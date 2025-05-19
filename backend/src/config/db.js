const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // console.log('Intentando conectar a MongoDB...');
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI no está definida. Valor actual:', process.env.MONGO_URI);
      throw new Error('MONGO_URI no está definida en el entorno');
    } else {
      // Mostrar solo el inicio de la URI para depuración
      // console.log('MONGO_URI detectada:', process.env.MONGO_URI.slice(0, 30) + '...');
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 