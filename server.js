const express = require('express');
const path    = require('path');
const mqtt    = require('mqtt');
const PORT    = 3333;
const app     = express();

// MQTT client setup
const mqttClient = mqtt.connect('mqtts://io.adafruit.com',{
  port     : 8883,
  username : process.env.ADAFRUIT_USERNAME,
  password : process.env.ADAFRUIT_PW
});

mqttClient.on('connect', () => {
  // mqttClient.subscribe('/hello');
  // mqttClient.publish('presence', 'Hello mqtt');
});

// EXPRESS server setup
app.use(express.static(__dirname));

// Root route - serve index.html (map)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen on PORT
app.listen(PORT, () => {
  console.log('listening on PORT: ' + PORT);
});