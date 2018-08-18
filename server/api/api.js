/*
 * Check config.json file
 */
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '../../config/server.json');
if (!fs.existsSync(configPath)) {
  throw new Error(
    'You need to create the config/index.js file from index.js.example'
  );
}

/*
 * Dependencies
 */
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const http = require('http');
const config = require('../../config/server');
const logger = require('../logger');
const loadRoutes = require('./routes/_routes');
const response = require('./response');
const tokenService = require('./services/tokenService');

/**
 * Create the app
 */
const app = express();
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(fileUpload());
app.use('/api/uploads', express.static(`${__dirname}/../uploads`));
app.use(tokenService.authenticateMiddleware);

/**
 * Configuring the app
 */
const port = (config.api && config.api.port) || 3001;
app.set('port', port);

/**
 * Adding the routes
 */
loadRoutes(app);

/**
 * Adding the response middleware
 */
app.use(response);

/**
 * Starting the app
 */
const server = http.createServer(app);
server.listen(port, () => {
  const address = server.address();
  logger.info(`API up and running on ${address.address}:${address.port}`);
});
