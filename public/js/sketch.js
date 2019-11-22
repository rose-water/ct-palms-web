import { countries } from './countries.js'

let greetingElem    = document.getElementById('greeting-msg');
let countryListElem = document.getElementById('country-list');
let sendBtn         = document.getElementById('send-btn');

let url    = new URL(window.location);
let socket = io.connect();
let palmId = url.searchParams.get('palmId');

socket.on('disconnect', ()=> {
  socket.disconnect();
})

let sampleLocations = [
  {
    "country": "United States",
    "cities": [
      "Los Angeles",
      "New York City",
      "Detroit",
      "Chicago",
      "Seattle"
    ]
  },

  {
    "country": "Japan",
    "cities": [
      "Tokyo",
      "Kyoto",
      "Osaka",
      "Nagoya",
      "Yokohama"
    ]
  },

  {
    "country": "India",
    "cities": [
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Hyderabad",
      "New Delhi"
    ]
  },

  {
    "country": "Philippines",
    "cities": [
      "Manila",
      "Quezon City",
      "Cebu",
      "Davao",
      "Caloocan"
    ]
  },

  {
    "country": "Germany",
    "cities": [
      "Berlin",
      "Frankfurt",
      "Munich",
      "Stuttgart",
      "Cologne"
    ]
  }
];

init();

// -------------------------------------------------------------
function init() {
  generateGreeting();
  generateCountriesDropdown();
  generateCitiesDropdown();

  sendBtn.addEventListener('click', (e) => {
    sendMessage(e);
  });
}

// -------------------------------------------------------------
function generateGreeting() {
  let greeting = `You are chatting with <b>${ palmId }</b>`;
  greetingElem.innerHTML = greeting;
}

// -------------------------------------------------------------
function generateCountriesDropdown() {
  // let dropdownMarkup = countries.map(country => {
  //   return `<option value=${ country['code'] }>${ country['name'] }</option>`
  // }).join('');

  let dropdownMarkup = sampleLocations.map(countryObj => {
    return `<option value=${ countryObj['country'] }>${ countryObj['country'] }</option>`
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
function sendMessage(e) {
  // Prevent refresh
  e.preventDefault();

  let country = countryListElem.options[countryListElem.selectedIndex].text

  socket.emit('location-data', {
    palmId : palmId,
    value  : country
  });
}