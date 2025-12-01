let pokemonTeamArray = []

let pokemonCardDisplay = document.querySelector(".pokemon-display")

// In your Pokemon card generation code, add the primary type as a class
    function getPrimaryType(pokemon) {
        return pokemon.type[0].toLowerCase(); // Get the first type
    }

// Render Pokemon
const renderPokemon = () => {
  

  pokemonCardDisplay.innerHTML = ""
  // Look through API for info

  for (let i = 0; i < pokemonTeamArray.length; i++) {

  let pokemon = pokemonTeamArray[i]
  
    let typeBadges = ""
    for (let j = 0; j < pokemon.type.length; j++) {
        typeBadges += `<span class="type-badge type-${pokemon.type[j].toLowerCase()}">${pokemon.type[j].toUpperCase()}</span>`;
    }

    let primaryType = getPrimaryType(pokemon);
    let pokemonCard = `
    <div class="pokemon-card type-${primaryType}">
        <div class="header">
            <h3>${pokemon.name.toUpperCase()}</h3>
            <div class="header-icons">
                <img src="${pokemon.isFemale ? `img/female-symbol.png`: `img/male-symbol.png`}" class="gender-img" alt="${pokemon.name}: gender"> 
                ${pokemon.isShiny ? `<img src="img/shiny-symbol.png" class="shiny-img" alt="${pokemon.name}: shiny">`: ''}
            </div>
        </div>
        
        <img src="${pokemon.spriteImageURL}" class="sprite-img" alt="${pokemon.name}">
        <p class="level">Level: ${pokemon.level}</p>

        <div>
            ${typeBadges}
        </div>
    </div>`;
    
    pokemonCardDisplay.innerHTML += pokemonCard;

  };
};

// Render Stats    
const renderStats = () => {

  // Calculate total pokemon
  let numberOfPokemon = pokemonTeamArray.length;
  let femaleCounter = 0;
  let maleCounter = 0;
  let shinyCounter = 0;
  let avgLevel = 0;

  pokemonTeamArray.forEach((pokemon) => {
  // Check if female male or shiny
    if ((genderAndShinyCount(pokemon)) === "Female-Shiny") {
      shinyCounter += 1;
      femaleCounter += 1;
    }
    if ((genderAndShinyCount(pokemon)) === "Male-Shiny") {
      shinyCounter += 1;
      maleCounter += 1;
    }
    if ((genderAndShinyCount(pokemon)) === "Female") {
      femaleCounter += 1;
    }
    if ((genderAndShinyCount(pokemon)) === "Male") {
      maleCounter += 1;
    }

    // caclulate avg level  
    avgLevel = avgLevel += parseInt(pokemon.level);

  });

  avgLevel = avgLevel / pokemonTeamArray.length;

  document.querySelector("#num-pokemon").innerText = numberOfPokemon;
  document.querySelector("#num-females").innerText = femaleCounter;
  document.querySelector("#num-males").innerText = maleCounter
  document.querySelector("#num-shinies").innerText = shinyCounter
  document.querySelector("#avg-level").innerText = avgLevel.toFixed(2);

};    

// Get info after submit
document.querySelector("#input-form").addEventListener('submit', async (event) => {

  event.preventDefault();

  let pokemonName = event.target.elements["pokemon-name"].value;
  let pokemonLevel = event.target.elements["pokemon-level"].value;
  let pokemonFemale = event.target.elements["pokemon-female"].checked;
  let pokemonMale = event.target.elements["pokemon-male"].checked;
  let pokemonShiny = event.target.elements["pokemon-shiny"].checked;
  let pokemonNotShiny = event.target.elements["pokemon-not-shiny"].checked;

  // console.log(pokemonName, pokemonLevel, pokemonFemale, pokemonMale)

  // Check if level is between 1 and 100
  let isValidLevel = pokemonLevelCheck(pokemonLevel)

  if (isValidLevel === false) {
    return;
  };

  // Check if name is a valid pokemon
  let isValidName = await validPokemonNameCheck(pokemonName);

  // Add check for valid pokemon name before pushing object or fetching data
  if (isValidName) {
    document.querySelector(".invalid-pokemon").classList.add("hidden"); 
  
    // Fetch user entered data
    let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonName.toLowerCase()

    // console.log(url)

    let response = await fetch(url);

    let data = await response.json();

    // Check if it is female or male for sprite
    shinyAndGenderImage(pokemonFemale, pokemonMale, pokemonShiny, pokemonNotShiny, data)

    // console.log(sprite)

    let typingArray =  data.types.map(type => type.type.name);

    // console.log(typingArray)


    // Create Pokemone object
    let pokemon = {
      id: pokemonTeamArray.length,
      name: pokemonName,
      level: pokemonLevel,
      isFemale: pokemonFemale,
      isMale: pokemonMale,
      isShiny: pokemonShiny,
      isNotShiny: pokemonNotShiny,
      spriteImageURL: sprite,
      type: typingArray
    };

    // Add the new pokemon object to the array
    pokemonTeamArray.push(pokemon);

    // console.log(pokemon)

    // renderPokemon();
    renderPokemon();

    // renderStats();
    renderStats();

  } else {
    document.querySelector(".invalid-pokemon").classList.remove("hidden");
  };

});
    
// Function to check if name is valid
const validPokemonNameCheck = async (pokemonName) => {
  // First get the limit for how many pokemon are in API/ valid pokemon
    let countResponse = await fetch("https://pokeapi.co/api/v2/pokemon");
    let countData = await countResponse.json();
    let totalCount = countData.count;

    // Create an array of pokemon names to compare input to
    let allPokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalCount}`);
    let allPokemonData = await allPokemonResponse.json();
    let validPokemonNames = allPokemonData.results.map(pokemon => pokemon.name);

    return validPokemonNames.includes(pokemonName.toLowerCase());
};


// Function to check if pokemon = female or male 
const shinyAndGenderImage = (pokemonFemale, pokemonMale, pokemonShiny, pokemonNotShiny, data) => {

  // sprite = data.sprites.front_default;
  sprite = `img/male-symbol.png`;

  if (pokemonFemale && pokemonShiny) {
    sprite = data.sprites.front_shiny_female;

    if (sprite === null || sprite === undefined) {
      sprite = data.sprites.front_shiny;
    }
  }

  else if (pokemonFemale && pokemonNotShiny) {
    sprite = data.sprites.front_female;

    if (sprite === null || sprite === undefined) {
      sprite = data.sprites.front_default;
    }
  }

  else if (pokemonMale && pokemonShiny) {
    sprite = data.sprites.front_shiny;
 
  }

  else if (pokemonMale && pokemonNotShiny) {
    sprite = data.sprites.front_default;

  };

  return sprite;
};

// Function to check level 
const pokemonLevelCheck = (pokemonLevel) => {
  // Hide both errors first
  document.querySelector(".invalid-level-under").classList.add("hidden");
  document.querySelector(".invalid-level-over").classList.add("hidden");

  if (pokemonLevel < 1 || pokemonLevel > 100) {
    document.querySelector(".invalid-level-under").classList.remove("hidden");
    return false;
  };
  if (pokemonLevel > 100) {
    document.querySelector(".invalid-level-over").classList.remove("hidden");
    return false;
  } 

  return true;
}


// MAYBE create function to count male or females - built in shiny counter too??
const genderAndShinyCount = (pokemon) => {
  if (pokemon.isFemale && pokemon.isShiny) {
    // If female and shiny 
    return "Female-Shiny";
  } 
  if (pokemon.isMale && pokemon.isShiny) {
    // If male and shiny 
    return "Male-Shiny";
  } 
  if (pokemon.isFemale) {
    // If female
    return "Female";
  } 
  if (pokemon.isMale) {
    // If male
    return "Male";
  };
  
};


// HTML
// <div class="pokemon-card">
//     <h3>POKEMON NAME</h3>
//     <img src="SPRITE LINK HERE" class="card-img-top" alt="...">
//     <div>
//         ${type badges here - loop through type array}
//         Example: <span class="type-badge type-fire">Fire</span>
//     </div>
//     <p class="level">Level: ${level}</p>
// </div>