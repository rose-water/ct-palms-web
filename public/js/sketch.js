// -------------------------------------------------------------
// Written by: Rachel Rose Waterhouse
// NOTE: These setTimeouts are a little out of hand, definitely
// not best practice. There are also some things that are probably 
// better handled by setting some app state but... it's fine. This
// is more for proof of concept anyway.
// -------------------------------------------------------------

// In case we want to use a longer list of countries 
// import { countries } from './countries.js'
let messageContainerElem = document.getElementById('message-container');
let formContainerElem    = document.getElementById('form-container');
let nameFormElem         = document.getElementById('name-form');
let locationFormElem     = document.getElementById('location-form');
let greetingElem         = document.getElementById('greeting-msg');
let countryListElem      = document.getElementById('country-list');
let cityListElem         = document.getElementById('city-list');
let sendBtn              = document.getElementById('send-btn');
let nameInputElem        = document.getElementById('name-input');

let url    = new URL(window.location);
let socket = io.connect();
let palmId = url.searchParams.get('palmId');

let selectedCountry;

socket.on('disconnect', ()=> {
  socket.disconnect();
})

let greetings = [
  `Hello! I'm ${ palmId }, a palm tree living in Los Angeles, but I'm originally from Brazil.`,
  "What's your name?",
  "Nice to meet you, ",
  "I'd like to introduce you to some of my friends.",
  "This is mexican-palm-06, a palm tree from Mexico. They've been here for almost 8 years now.",
  "And this is spanish-palm-03, from Spain. They're new to town.",
  "What about you? Where are you from?",
  "So cool that you're from ",
  "I hope one day I can visit 😎",
  "Here's a <a href=\"/livemap\" target=\"_blank\">map</a> of where other people in L.A. are from!",
  "It's been nice chatting with you. Feel free to visit some of my friends! See you later! 👋",
];


let sampleLocations = [
  {
    "country": "United States",
    "cities": [
      {
        "city": "Los Angeles",
        "coords": {
          "lat" : 34.052235,
          "lon" : -118.243683
        }
      },

      {
        "city": "New York City",
        "coords": {
          "lat" : 40.730610,
          "lon" : -73.935242
        }
      },

      {
        "city": "Chicago",
        "coords": {
          "lat" : 41.881832,
          "lon" : -87.623177
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
          "lat" : 35.6804,
          "lon" : 139.7690
        }
      },
      {
        "city": "Kyoto",
        "coords": {
          "lat" : 35.0116,
          "lon" : 135.7681
        }
      },
      {
        "city": "Osaka",
        "coords": {
          "lat" : 34.6937,
          "lon" : 135.5023
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
  generateLocationForm();
  initConversation();

  formContainerElem.style.display = 'none';
  sendBtn.classList.add('disabled');

  // Not a good way to do this
  window.setInterval(function() {
    messageContainerElem.scrollTop = messageContainerElem.scrollHeight;
  }, 100);
}

// -------------------------------------------------------------
function generateGreeting() {
  let greeting = `You are chatting with <b>${ palmId }</b> 🌴😎`;
  greetingElem.innerHTML = greeting;
}

// -------------------------------------------------------------
function generateLocationForm() {
  generateCountriesDropdown();

  // Yeah, not the right way to initialize the selected 
  // country with corresponding city, but it's fine for this
  handleUpdateCitiesDropdown("United States");

  countryListElem.addEventListener('change', (e) => {
    handleUpdateCitiesDropdown(e.target.value);
  });

  // Hide the location form at first
  locationFormElem.style.display = 'none';
}

// -------------------------------------------------------------
function generateCountriesDropdown() {
  // If we wanted more countries available, however we don't
  // have corresponding cities for the other countries:
  // let dropdownMarkup = countries.map(country => {
  //   return `<option value=${ country['code'] }>${ country['name'] }</option>`
  // }).join('');

  let dropdownMarkup = sampleLocations.map(countryObj => {
    return `<option value="${ countryObj['country'] }">${ countryObj['country'] }</option>`
  }).join('');
  countryListElem.innerHTML = dropdownMarkup;
}


// -------------------------------------------------------------
function handleUpdateCitiesDropdown(countryName) {
  selectedCountry = sampleLocations.filter(countryObj => {
    return countryObj["country"] == countryName;
  })[0];

  let dropdownMarkup = selectedCountry['cities'].map(cityObj => {
    return `<option value=${ cityObj['city'] }>${ cityObj['city'] }</option>`
  }).join('');

  cityListElem.innerHTML = dropdownMarkup;
}


// -------------------------------------------------------------
function generateTextFromPalm(msg) {
  let palmMsgMarkup = `
    <div class="palm-msg-container">
      <div class="palm-icon">🌴</div>
      <div class="palm-msg-text-container">
        <p class="palm-msg-text">${ msg }</p>
      </div>
    </div>
  `;

  return palmMsgMarkup;
}


// -------------------------------------------------------------
function generateTextFromUser(msg) {
  let userMsgMarkup = `
    <div class="user-msg-container">
      <div class="user-msg-text-container">
        <p class="user-msg-text">${ msg }</p>
      </div>
      <div class="user-icon">
        <img class="user-icon-img" src="assets/user-icon.png" />
      </div>
    </div>
  `;

  return userMsgMarkup;
}

// -------------------------------------------------------------
function initConversation() {
  // Icky way to do this 💩

  setTimeout(() => {
    socket.emit(palmId, {
      msg: "hello_behavior"
    });
    
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[0]);
  }, 2000);
  
  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[1]);
  }, 7000);

  setTimeout(() => {
    handleAskForName();
  }, 8000);
}

// -------------------------------------------------------------
function handleAskForName() {
  // assign event listener for send button
  sendBtn.addEventListener('click', handleSendName);

  formContainerElem.style.display = 'flex';
  nameFormElem.style.display      = 'block';
  
  messageContainerElem.classList.add('shortsize');
  messageContainerElem.classList.remove('fullsize');
  
  sendBtn.classList.remove('disabled');
  sendBtn.classList.add('enabled');
}

// -------------------------------------------------------------
function handleSendName() {
  let userName = nameInputElem.value;

  socket.emit('name-data', {
    name: userName
  });

  setTimeout(() => {
    formContainerElem.style.display = 'none';
    nameFormElem.style.display      = 'none';
    messageContainerElem.classList.remove('shortsize');
    messageContainerElem.classList.add('fullsize');
    messageContainerElem.innerHTML += generateTextFromUser(userName);
    
    // change styling and remove eventlistener
    sendBtn.classList.remove('enabled');
    sendBtn.classList.add('disabled');
    sendBtn.removeEventListener('click', handleSendName)
  }, 1000);

  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[2] + userName + '! ' + greetings[3]);
  }, 3000);


  handleIntroToFriends();
}


// -------------------------------------------------------------
function handleIntroToFriends() {

  // mexican-palm-06
  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[4]);

    // Emit to server, to pub to cloud
    socket.emit('mexican-palm-06', {
      msg: "hello_behavior"
    });
  }, 5000);

  // spanish-palm-03
  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[5]);

    // Emit to server, to pub to cloud
    socket.emit('spanish-palm-03', {
      msg: "hello_behavior"
    });
  }, 12000);

  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[6]);
  }, 16000);

  setTimeout(() => {
    handleAskForLocation();
  }, 18000)
}


// -------------------------------------------------------------
function handleAskForLocation() {
  // assign event listener for send button
  sendBtn.addEventListener('click', handleSendLocation);

  formContainerElem.style.display = 'flex';
  locationFormElem.style.display  = 'block';
  
  messageContainerElem.classList.add('shortsize');
  messageContainerElem.classList.remove('fullsize');
  
  sendBtn.classList.remove('disabled');
  sendBtn.classList.add('enabled');
}


// -------------------------------------------------------------
function handleSendLocation() {

  let countryName = countryListElem.options[countryListElem.selectedIndex].text;
  let cityName = cityListElem.options[cityListElem.selectedIndex].text;

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

  socket.emit('marker-data', selectedLocation); 

  socket.emit('location-data', {
    palmId  : palmId,
    country : countryName,
    city    : cityName
  });

  setTimeout(() => {
    formContainerElem.style.display = 'none';
    locationFormElem.style.display  = 'none';
    messageContainerElem.classList.remove('shortsize');
    messageContainerElem.classList.add('fullsize');

    messageContainerElem.innerHTML += generateTextFromUser(`I'm from ${ cityName }, ${ countryName }.`);

    // change styling and remove eventlistener
    sendBtn.classList.remove('enabled');
    sendBtn.classList.add('disabled');
    sendBtn.removeEventListener('click', handleSendLocation)
  }, 1000);

  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[7] + countryName + '! ' + greetings[8]);
  }, 3000);

  handleGoodbye();
}


// -------------------------------------------------------------
function handleGoodbye() {
  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[9]);
  }, 6000);

  setTimeout(() => {
    messageContainerElem.innerHTML += generateTextFromPalm(greetings[10]);
  }, 9000);
}