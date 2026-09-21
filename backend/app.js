const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignored in serverless/restricted environments
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    res.status(500).json({ error: 'Error de conexión con la base de datos', message: error.message });
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
  res.json({ status: 'ok', message: 'SmartBakery Backend is running' });
});

// Mount router on both /api and root /
app.use('/api', apiRouter);
app.use('/', apiRouter);

module.exports = { app, connectDB };
