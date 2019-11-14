const express = require('express');
const path    = require('path');
const mqtt    = require('mqtt');
const PORT    = 3333;
const app     = express();
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);
require('dotenv').config();

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
//    as a POST request 
// 5. Server handles POST request and gets country and citydata 
//    from query, pubs to topic (from query also). 

// I guess the topics list should be an imported file
// I wonder if there's a way to import a list of topics to 
// Adafruit? OR IS IT MANUAL :(
let topicsList = [ 'testTopic' ];

const mqttClient = mqtt.connect('mqtts://io.adafruit.com',
  {
    port     : 8883,
    username : process.env.ADAFRUIT_USERNAME,
    password : process.env.ADAFRUIT_PW
  }
);

mqttClient.on('connect', () => {
  console.log('MQTT client connected.')
  mqttClient.subscribe(baseUrl + topicsList[0]);
});

mqttClient.on('error', (error) => {
  console.log('MQTT Client Errored');
  console.log(error);
});

mqttClient.on('message', (topic, message) => {
  console.log('msg from topic ' + topic + ': ' + message.toString());
});


// -------------------------------------------------------------
// EXPRESS server setup
app.use(express.static('public'));

// Root route - serve index.html (map)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Palm route - serve a form
// localhost:3333?palmId=brazil-palm-01
app.get('/palms/:palmId', (req, res) => {
  
});

app.get('/maps/livemap', (req, res) => {
  
});

app.get('/maps/allMarkers', (req, res) => {
 
});

app.get('/countryData', (req, res) => {
  
});

app.get('/citiesData', (req, res) => {
  
});


// Listen on PORT
server.listen(PORT, () => {
  console.log('Listening on PORT: ' + PORT);
});