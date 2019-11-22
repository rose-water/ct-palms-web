const express = require('express');
const path    = require('path');
const mqtt    = require('mqtt');
const PORT    = 3333;
const app     = express();
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);
require('dotenv').config();

// In the real world this would be stored in a database,
// and clients would be checking for updates periodically
// but out of scope for this, just storing in memory
let userLocations = [];

// -------------------------------------------------------------
// MQTT client setup
let baseUrl = `${ process.env.ADAFRUIT_USERNAME }/feeds/`;

// Eventually subscribe to a list of topics, each corresponding
// to specific devices + MAC addresses?

// Is this the right order?
// 1. esp32 device boots up, connects to wifi.
// 2. esp32 device subs to designated topic, as well as another 
//    generic topic to notify node that a device is available.
// 3. Interaction happens on the device, outputs url for user
// 4. User on phone navigates to url, will choose city and
//    country on webpage along with device ID (from url?), sent 
//    over websockets to node server
// 5. node server gets country and city data from sockets 
//    pubs to topic (from query also). 

// I guess the topics list should be an imported file
// I wonder if there's a way to import a list of topics to 
// Adafruit? OR IS IT MANUAL :(

let topicsList = [ 'brazil-palm-01' ];

const mqttClient = mqtt.connect('mqtts://io.adafruit.com',
  {
    port     : 8883,
    username : process.env.ADAFRUIT_USERNAME,
    password : process.env.ADAFRUIT_PW
  }
);

mqttClient.on('connect', () => {
  console.log('MQTT client connected.')
});


mqttClient.on('error', (error) => {
  console.log('MQTT Client Errored');
  console.log(error);
});


// When we get data from the form frontend
io.on('connection', client => {
  console.log('Socket client connected.');

  client.on('location-data', data => {
    // console.log('location-data: ', data.value)
    mqttClient.publish(baseUrl + topicsList[0], data.country);
  });

  client.on('disconnect', () => {
    console.log('Socket client disconnected.');
  })
});

// -------------------------------------------------------------
// EXPRESS server setup
app.use(express.static('public'));
// app.use(express.static('public', { index: false } ));

// Root route - redirect to map
app.get('/', (req, res) => {
  // TODO currently not working for some reason
  res.redirect('/maps/livemap');
});

// Should serve the form
// localhost:3333?palmId=brazil-palm-01
app.get('/:palmId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/maps/livemap', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'livemap.html'));
});

app.get('/maps/allMarkers', (req, res) => {
 
});

app.get('/citiesData', (req, res) => {
  
});

// -------------------------------------------------------------
// Listen on PORT
server.listen(PORT, () => {
  console.log('Listening on PORT: ' + PORT);
});