const express = require('express');
const path    = require('path');
const PORT    = 3333;
const app     = express();

// SERVER SETUP
app.use(express.static(__dirname));

// Root route - serve index.html (map)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen on PORT
app.listen(PORT, () => {
  console.log('listening on PORT: ' + PORT);
});