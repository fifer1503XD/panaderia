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

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection helper with connection caching for serverless environments
let isConnected = false;
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/panaderia';
  if (!process.env.MONGODB_URI) {
    console.warn('ADVERTENCIA: No se encontró MONGODB_URI en las variables de entorno.');
  }
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  isConnected = true;
}

// Middleware to ensure DB connection
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

apiRouter.use('/products', require('./routes/productRoutes'));
apiRouter.use('/inventory', require('./routes/inventoryRoutes'));
apiRouter.use('/categories', require('./routes/categoryRoutes'));
apiRouter.use('/categorias', require('./routes/categoryRoutes'));
apiRouter.use('/payment-methods', require('./routes/paymentMethodRoutes'));
apiRouter.use('/metodopagos', require('./routes/paymentMethodRoutes'));
apiRouter.use('/metodos-pago', require('./routes/paymentMethodRoutes'));
apiRouter.use('/sales', require('./routes/saleRoutes'));
apiRouter.use('/ventas', require('./routes/saleRoutes'));

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SmartBakery Backend is running',
    environment: process.env.NODE_ENV || 'development',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mount router on all potential Netlify path variations
app.use('/.netlify/functions/api', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

module.exports = { app, connectDB };
