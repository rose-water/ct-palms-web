# Creative Technology I
# LA Embedded Device
### Rachel Rose Waterhouse
### Tingyi Li

-----
#### LA Palms + People Provenance
Brief goes here

-----
## SETUP

### I. Credentials
This project uses the [Adafruit IO MQTT](https://io.adafruit.com/api/docs/mqtt.html#adafruit-io-mqtt-api).

You will need to create a `.env` file with your adafruit.io username and password, so that these lines in `server.js` work:

`process.env.ADAFRUIT_USERNAME`
`process.env.ADAFRUIT_PW`

Alternatively replace them with your username and password directly, but make sure not to push that change to Github 😎.


---
### II. Prerequisites
Make sure you have Node and NPM installed. I use [Homebrew](https://brew.sh/) for my installs; this is a good [reference](https://treehouse.github.io/installation-guides/mac/node-mac.html).


---
### III. Node setup
In your terminal:

`npm install` to install node dependencies.
`npm start` to start the server.

Alternatively, install [Nodemon](https://www.npmjs.com/package/nodemon) to automatically restart your server when saving changes:

`npm run dev`

Finally, navigate to `localhost:3333` in a web browser.


---
### IV. Documentation