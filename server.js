const express = require('express');
const path    = require('path');
const mqtt    = require('mqtt');
const PORT    = 3333;
const app     = express();
require('dotenv').config();

// -------------------------------------------------------------
// MQTT client setup

let baseUrl = 'rosewater/feeds/';

// Eventually subscribe to a list of topics, each corresponding
// to specific devices + MAC addresses?
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
app.use(express.static(__dirname));

// Root route - serve index.html (map)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen on PORT
app.listen(PORT, () => {
  console.log('Listening on PORT: ' + PORT);
});