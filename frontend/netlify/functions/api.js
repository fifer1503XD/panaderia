import serverless from 'serverless-http';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { app } = require('../../../backend/app');

export const handler = serverless(app);
