import { countries } from './countries.js'

let greetingElem    = document.getElementById('greeting-msg');
let countryListElem = document.getElementById('country-list');
let cityListElem    = document.getElementById('city-list');
let sendBtn         = document.getElementById('send-btn');

let url    = new URL(window.location);
let socket = io.connect();
let palmId = url.searchParams.get('palmId');

let selectedCountry;

socket.on('disconnect', ()=> {
  socket.disconnect();
})

let sampleLocations = [
  {
    "country": "United States",
    "cities": [
      {
        "city": "Los Angeles",
        "coords": {
          "lat" : 34.0522,
          "lon" : 118.2437
        }
      },

      {
        "city": "New York City",
        "coords": {
          "lat" : 40.7128,
          "lon" : 74.0060
        }
      },

      {
        "city": "Chicago",
        "coords": {
          "lat" : 41.8781,
          "lon" : 87.6298
        }
      }
    ]
  },

  {
    "country": "Japan",
    "cities": [
      {
        "city": "Tokyo",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Kyoto",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Osaka",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      }
    ]
  },

  {
    "country": "India",
    "cities": [
      {
        "city": "Mumbai",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Bangalore",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Chennai",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      }
    ]
  },

  {
    "country": "Philippines",
    "cities": [
      {
        "city": "Manila",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Quezon City",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Cebu",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      }
    ]
  },

  {
    "country": "Germany",
    "cities": [
      {
        "city": "Berlin",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Frankfurt",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      },
      {
        "city": "Munich",
        "coords": {
          "lat" : 0.0,
          "lon" : 0.0
        }
      }
    ]
  }
];

init();

// -------------------------------------------------------------
function init() {
  generateGreeting();
  generateCountriesDropdown();

  // Yeah, not the right way to initialize the selected 
  // country with corresponding city, but it's fine for this
  handleUpdateCitiesDropdown("United States");

  sendBtn.addEventListener('click', (e) => {
    sendMessage(e);
  });

  countryListElem.addEventListener('change', (e) => {
    console.log(`e.target.value = ${ e.target.value }`);
    handleUpdateCitiesDropdown(e.target.value);
  });

}

// -------------------------------------------------------------
function generateGreeting() {
  let greeting = `You are chatting with <br/><b>${ palmId }</b>`;
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
function handleUpdateCitiesDropdown(countryName) {
  console.log('[handleUpdateCitiesDropdown] countryName: ', countryName);

  selectedCountry = sampleLocations.filter(countryObj => {
    return countryObj["country"] == countryName;
  })[0];

  console.log('SELECTED COUNTRY: ', selectedCountry);

  let dropdownMarkup = selectedCountry['cities'].map(cityObj => {
    return `<option value=${ cityObj['city'] }>${ cityObj['city'] }</option>`
  }).join('');

  cityListElem.innerHTML = dropdownMarkup;
}


// -------------------------------------------------------------
function sendMessage(e) {
  // Prevent refresh
  e.preventDefault();

  let countryName = countryListElem.options[countryListElem.selectedIndex].text;
  let cityName = cityListElem.options[cityListElem.selectedIndex].text;

  // Prob better handled by setting some state but it's fine
  // Get city object data
  let selectedCityObj = selectedCountry['cities'].filter(cityObj => {
    return cityObj["city"] == cityName
  })[0];

  let selectedLocation = {
    "country" : countryName,
    "city"    : selectedCityObj["city"],
    "lat"     : selectedCityObj["coords"]["lat"],
    "lon"     : selectedCityObj["coords"]["lon"]
  };

  // This probably doesn't need sockets? Since they're only
  // going to submit this once, but it's fine
  socket.emit('marker-data', selectedLocation); 

  socket.emit('location-data', {
    palmId : palmId,
    country  : countryName
  });
}