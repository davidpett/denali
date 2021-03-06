const path = require('path');
const Application = require('./application');

let application = new Application({
  environment: process.env.DENALI_ENV || process.env.NODE_ENV || 'development',
  dir: path.dirname(__dirname)
});

application.start();

module.exports = application;
