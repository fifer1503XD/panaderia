const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartBakery Backend is running' });
});

// Database connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/panaderia';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado exitosamente');
    app.listen(PORT, () => {
      console.log(`Servidor backend ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error.message);
  });
