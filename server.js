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
let markerLocations = [];

// -------------------------------------------------------------
// MQTT client setup
let baseUrl = `${ process.env.ADAFRUIT_USERNAME }/feeds/`;

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

  client.on('marker-data', data => {
    markerLocations.push(data);
    console.log('marker locations updated: ', markerLocations);
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