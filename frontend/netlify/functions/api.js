const serverless = require('serverless-http');

let appModule;
try {
  appModule = require('../../../backend/app');
} catch (e) {
  try {
    appModule = require('../../backend/app');
  } catch (e2) {
    const path = require('path');
    appModule = require(path.resolve(__dirname, '../../../backend/app'));
  }
}

const handler = serverless(appModule.app);

module.exports = { handler };
exports.handler = handler;
