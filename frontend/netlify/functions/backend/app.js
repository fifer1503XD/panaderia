const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

if (!process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.NETLIFY) {
  try {
    const dns = require("dns");
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {
    // Ignored in serverless/restricted environments
  }
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

function getMongoUri() {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    process.env.VITE_MONGODB_URI ||
    process.env.DATABASE_URL ||
    null
  );
}

// Database connection helper with connection caching for serverless environments
let isConnected = false;
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const MONGO_URI = getMongoUri();
  if (!MONGO_URI) {
    throw new Error('No se encontró la variable MONGODB_URI en el entorno de Netlify. Configúrala en Site configuration -> Environment variables.');
  }
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  isConnected = true;
}

// Diagnostic health route accessible even if DB is down
app.get(['/health', '/api/health', '/.netlify/functions/api/health'], async (req, res) => {
  const uri = getMongoUri();
  let dbStatus = 'disconnected';
  let dbError = null;

  try {
    await connectDB();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message;
  }

  res.json({
    status: 'ok',
    message: 'SmartBakery Backend is running',
    hasMongoUri: !!uri,
    mongoHost: uri && uri.includes('@') ? uri.split('@')[1].split('/')[0] : (uri ? 'configured' : 'NOT_CONFIGURED'),
    dbStatus,
    dbError,
    availableEnvKeys: Object.keys(process.env).filter(k => !k.toLowerCase().includes('secret') && !k.toLowerCase().includes('token'))
  });
});

// Middleware to ensure DB connection for all API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    return res.status(500).json({
      error: 'Error de conexión con la base de datos MongoDB',
      details: error.message,
      hint: 'Verifica que MONGODB_URI esté configurada en Netlify y que MongoDB Atlas tenga acceso de IP 0.0.0.0/0 habilitado.'
    });
  }
});

// Create router for all API endpoints
const apiRouter = express.Router();

apiRouter.use('/products', productRoutes);
apiRouter.use('/inventory', inventoryRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/categorias', categoryRoutes);
apiRouter.use('/payment-methods', paymentMethodRoutes);
apiRouter.use('/metodopagos', paymentMethodRoutes);
apiRouter.use('/metodos-pago', paymentMethodRoutes);
apiRouter.use('/sales', saleRoutes);
apiRouter.use('/ventas', saleRoutes);

// Mount router on all potential Netlify path variations
app.use('/.netlify/functions/api', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

module.exports = { app, connectDB };
