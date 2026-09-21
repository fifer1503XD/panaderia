import serverless from 'serverless-http';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { app } = require(path.resolve(__dirname, '../../../backend/app'));

export const handler = serverless(app);
