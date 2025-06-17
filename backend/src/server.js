const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Sale del proceso si no se puede conectar a la DB
  }); 