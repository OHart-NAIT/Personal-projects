/*
    This is a simplified version of the example code in the Bootstrap documentation.
    https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
*/

const htmlElement = document.documentElement;
const switchElement = document.getElementById('darkModeSwitch');

// Set the default theme to dark if no setting is found in local storage
const currentTheme = localStorage.getItem('bsTheme') || 'dark';
htmlElement.setAttribute('data-bs-theme', currentTheme);
switchElement.checked = currentTheme === 'dark';

switchElement.addEventListener('change', function () {
    if (this.checked) {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('bsTheme', 'dark');
    } else {
        htmlElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('bsTheme', 'light');
    }
});