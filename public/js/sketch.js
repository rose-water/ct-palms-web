import { countries } from './countries.js'

let greetingElem = document.getElementById('greeting-msg');
let countryListElem = document.getElementById('country-list');
let sendBtn = document.getElementById('send-btn');

init();
// -------------------------------------------------------------


// -------------------------------------------------------------
function init() {
  generateGreeting();
  generateCountriesDropdown();
  generateCitiesDropdown();
  sendBtn.addEventListener('click', () => {
    sendMessage();
  })
}

// -------------------------------------------------------------
function generateGreeting() {
  let url = new URL(window.location);
  let palmId = url.searchParams.get('palmId');
  let greeting = `You are speaking to <b>${ palmId }</b>`;
  greetingElem.innerHTML = greeting;
}

// -------------------------------------------------------------
function generateCountriesDropdown() {
  let dropdownMarkup = countries.map(country => {
    return `<option value=${ country['code'] }>${ country['name'] }</option>`
  }).join('');
  countryListElem.innerHTML = dropdownMarkup;
}

// -------------------------------------------------------------
// TODO: Handle country dropdown changes, so that you can make a 
// call to get list of cities


// -------------------------------------------------------------
function getCities() {
  // TODO
}

// -------------------------------------------------------------
function generateCitiesDropdown() {

}

// -------------------------------------------------------------
function sendMessage() {
  console.log('sendMessage');
  let country = countryListElem.options[countryListElem.selectedIndex].value
  console.log('[ handleFormSubmit ] country: ', country);
}