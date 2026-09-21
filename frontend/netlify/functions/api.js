const serverless = require('serverless-http');
const { app } = require('../../../backend/app');

const handler = serverless(app);

exports.handler = handler;
