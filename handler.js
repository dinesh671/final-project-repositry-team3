'use strict';
const serverless = require('serverless-http');
const app = require('./backend/server'); // ← change this to your main file name (server.js or app.js or index.js)
module.exports.handler = serverless(app);

