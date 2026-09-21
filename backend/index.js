const { app, connectDB } = require('./app');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log('MongoDB conectado exitosamente');
    app.listen(PORT, () => {
      console.log(`Servidor backend ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error.message);
  });
