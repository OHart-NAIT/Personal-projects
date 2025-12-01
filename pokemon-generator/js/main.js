// Checkbox values to PokéAPI dex names
const regionToPokedex = {
    'kanto': ['kanto'],
    'johto': ['original-johto'],
    'hoenn': ['hoenn'],
    'sinnoh': ['original-sinnoh'],
    'sinnoh_pt': ['extended-sinnoh'],
    'unova': ['original-unova'],
    'unova_b2w2': ['updated-unova'],
    'galar': ['galar'],
    'hisui': ['hisui'],
    'lumiose': ['lumiose-city'],
    'kalos': ['kalos-central', 'kalos-coastal', 'kalos-mountain'],
    'alola': ['original-melemele', 'original-akala', 'original-ulaula', 'original-poni'],
    'alola_usum': ['updated-melemele', 'updated-akala', 'updated-ulaula', 'updated-poni'],
    'paldea': ['paldea'],
    'kitakami': ['kitakami'],
    'blueberry': ['blueberry']
};

// Variable Flag for generating pokemon
let isGenerating = false;

// Toggle function for all popups
function setupPopupToggles() {
    // Add click event to all dropdown buttons
    document.querySelectorAll('.dropdown > button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            
            // Close all other popups
            document.querySelectorAll('.popup').forEach(popup => {
                if (popup !== this.nextElementSibling) {
                    popup.classList.remove('show');
                }
            });
            
            // Toggle the current popup
            const popup = this.nextElementSibling;
            popup.classList.toggle('show');
        });
    });
    
    // Close popups when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.popup').forEach(popup => {
            popup.classList.remove('show');
        });
    });
    
    // Prevent popup from closing when clicking inside it
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Add "Select All" functionality to all dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const popup = dropdown.querySelector('.popup');
        const allCheckbox = popup.querySelector('input[data-select-all="true"]');
        const otherCheckboxes = popup.querySelectorAll('input[name]:not([data-select-all="true"])');
        
        if (allCheckbox) {
            // Handle Select All checkbox change
            allCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                
                // Update all other checkboxes
                otherCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
            });
        }
    });
}
// Initialize when DOM is loaded
setupPopupToggles();

// Function to get selected regions
const getSelectedRegions = () => {
    let selectedRegions = Array.from(document.querySelectorAll('input[name="regions"]:checked'))
        .map(checkbox => checkbox.value)
        .filter(value => value !== 'all');
    
    let pokedexURLs = [];
    
    selectedRegions.forEach(region => {
        let dexNames = regionToPokedex[region];
        if (dexNames) {
            dexNames.forEach(dexName => {
                // Build the URL directly instead of searching pokedexList
                let pokedexURL = `https://pokeapi.co/api/v2/pokedex/${dexName}/`;
                pokedexURLs.push(pokedexURL);
            });
        }
    });
    
    // console.log(selectedRegions)
    return pokedexURLs;
}

// Function to get evolution preferences 
const getEvolutionPreferences = () => {
    let allowBasic = document.querySelector("#not-fully-evolved").checked;
    let allowFullEvolution = document.querySelector("#fully-evolved").checked;
    let allowBoth = !allowBasic && !allowFullEvolution // SHow all if unchecked

    return {
        allowBasicForms: allowBasic,
        allowFinalForms: allowFullEvolution,
        allowAllForms: allowBoth
    };
};

// Get number of pokemon
const getNumberOfPokemon = () => {
    let numOfPokemon = document.querySelector("#number")

    return parseInt(numOfPokemon.value);
}

// Get display options
const getDisplayPrefrences = () => {
    let displaySelection = document.querySelector("#display");

    return displaySelection.value;
}

// Get pokemon data from regions
const fetchPokemonFromRegions = async (pokedexURLs) => {
    let allPokemon = [];

    for (let url of pokedexURLs) {
        let response = await fetch(url);
        let pokedexData = await response.json();

        pokedexData.pokemon_entries.forEach(entry => {
            let pokemonName = entry.pokemon_species.name;
            if (!allPokemon.includes(pokemonName)) {
                allPokemon.push(pokemonName);
            }
        });

    }

    return allPokemon;
}

// Check if fully evolved
const checkFullyEvolved = async (pokemonName) => {
    let url = "https://pokeapi.co/api/v2/pokemon-species/" + pokemonName.toLowerCase();

    let response = await fetch(url);
    let speciesData = await response.json();

    let evolutionResponse = await fetch(speciesData.evolution_chain.url);
    let evolutionData = await evolutionResponse.json();

    return checkEvolutionChain(evolutionData.chain, pokemonName)


}

// Helper function - checks evolution chain
const checkEvolutionChain = (chain, targetPokemonName) => {
    // Starts at begining of evolution chain - ex. searching for venusaur

    // check if pokemon is found at this level - ex. bulbasaur !== Venusaur
     if (chain.species.name === targetPokemonName) {
        // If evolves_to is empty/ length = 0, means no further evolutions
        return chain.evolves_to.length === 0;
    }

    // Move to the next evolution in the chain
    for (let evolution of chain.evolves_to) {
        //  ex. evolution = Venusaur object
        let result = checkEvolutionChain(evolution, targetPokemonName);
        // ex. "venusaur" = "venusaur" = match
        if (result !== null) {
            // Only returns if something is found
            return result;
        }
    }

    return null; // if Pokémon is not found in this chain at all
}

// check if not fully evolved
const filterNotFullyEvolved = async (pokemonList) => {
    const results = [];
    
    for (let pokemonName of pokemonList) {
        const fullyEvolved = await checkFullyEvolved(pokemonName);
        // If it's NOT fully evolved, add to results
        if (fullyEvolved === false) {
            results.push(pokemonName);
        }
    }
    
    return results;
}

// filter by evolution prefrences
const filterPokemonByEvolution = async (pokemonList, evolutionPrefs) => {
    if (evolutionPrefs.allowAllForms) {
        // If user selected all or neither, returns list as normal
        return pokemonList;
    }
    
    // Use filterNotFullyEvolved for basic forms
    if (evolutionPrefs.allowBasicForms && !evolutionPrefs.allowFinalForms) {
        return await filterNotFullyEvolved(pokemonList);
    }
    
    // For final forms only, filter out non-fully evolved
    if (evolutionPrefs.allowFinalForms && !evolutionPrefs.allowBasicForms) {
        let filteredPokemon = [];
        for (let pokemonName of pokemonList) {  // Make sure this uses pokemonName
            let fullyEvolved = await checkFullyEvolved(pokemonName);
            if (fullyEvolved === true) {
                filteredPokemon.push(pokemonName);
            }
        }
        return filteredPokemon;
    }
    
    // If both are checked, return all (same as allowAllForms)
    return pokemonList;
}
// Get sprite URL
const getPokemonSpriteURL = async (pokemonName) => {

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)

    if (!response || !response.ok) {
        return await spriteSpecialFormURL(pokemonName)
        
    } else {
        let data = await response.json();
        return data.sprites.front_default;   
    }
    
}

// Function to get sprite based on form if sprite link causes error
const spriteSpecialFormURL = async (pokemonName) => {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`)
    let data = await response.json();
    let specialFormName = data.varieties[0].pokemon.name

    console.log(specialFormName);

    let specialFormResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${specialFormName}/`)
    let specialFormData = await specialFormResponse.json()
    
    return specialFormData.sprites.front_default;
}
// Generate random pokemon
const generateRandomPokemon = async () => {
    // Display area
    let displayArea = document.querySelector(".pokemon-display");

    // Prevent multiple simultaneous generations
    if (isGenerating) {
        console.log("Already generating, please wait...");
        return;
    }
    
    isGenerating = true;
    
    // User preferences
    let pokemonCount = getNumberOfPokemon();
    let pokedexURLs = getSelectedRegions();
    let evolutionPrefs = getEvolutionPreferences();
    let displayOptions = getDisplayPrefrences();

    loadingMessage(displayArea);

    // If no regions are selected
    if (pokedexURLs.length === 0) {
        displayArea.innerHTML = '<div class="error">Please select at least one region!</div>';
        return;
    }

    let allPokemon = await fetchPokemonFromRegions(pokedexURLs);

    let filteredEvolutionPokemon = await filterPokemonByEvolution(allPokemon, evolutionPrefs)

    // If no pokemon come up after filtering
    if (filteredEvolutionPokemon.length === 0) {
        displayArea.innerHTML = '<div class="error">No Pokémon match your criteria. Try different settings.</div>';
        return;
    }

    let selectedPokemon = []
    // Duplicate array so no errors come in accidental modification
    let availablePokemon = filteredEvolutionPokemon.slice();

    // Compares users prefered amount to the pokemon avalible that meet criteria - never selects more than whats avaliable
    for (let i = 0; i < Math.min(pokemonCount, availablePokemon.length); i++) {
        //  creates random number for an index
        let randomIndex = Math.floor(Math.random() * availablePokemon.length);

        // Pushes selected pokemone with random number index
        selectedPokemon.push(availablePokemon[randomIndex]);
        
        // Removes selected Pokémon from available pokemon to avoid duplicates
        availablePokemon.splice(randomIndex, 1);   
    }

    console.log(selectedPokemon);
    // console.log(selectedPokemon.length)
    await displayPokemon(selectedPokemon, displayOptions, displayArea)
    
    // Reset the flag after completion
    isGenerating = false;

}

// Loading message while team loads
const loadingMessage = (message) => {
    message.innerHTML = '<div class="loading">Generating your Pokémon team<span class="dots"></span></div>';

    const dotsElement = document.querySelector('.dots');
    const dotPatterns = ['.', '..', '...', '....','.....','....', '...', '..' ];
    let currentPattern = 0;

    setInterval(() => {
        dotsElement.textContent = dotPatterns[currentPattern];
        currentPattern = (currentPattern + 1) % dotPatterns.length;
    }, 400);
}

// Render Pokemon
const displayPokemon = async (pokemonList, displayOptions, displayArea) => {
    displayArea.innerHTML  = "";

    for (let pokemonName of pokemonList) {
        let spriteImg = await getPokemonSpriteURL(pokemonName);
        
        let pokemonCard = "";
        if (displayOptions === 'names') {
            pokemonCard = `<div class = "pokemon-card"><h3>${pokemonName}</h3></div>`;
        } else if (displayOptions === 'sprites') {
            pokemonCard = `<div class = "pokemon-card"><img src="${spriteImg}" alt="${pokemonName}"></div>`;
        } else {
            pokemonCard = `<div class = "pokemon-card">
                <img src="${spriteImg}" alt="${pokemonName}">
                <h3>${pokemonName}</h3>
            </div>`;
        }
        
        // Append each card as it's created
        displayArea.innerHTML += pokemonCard;
    }
}


// Add event listener to the form submit
document.querySelector("#input-form").addEventListener('submit', (event) => {
        event.preventDefault();

        generateRandomPokemon()

        isGenerating = true;
});