const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // options not required for modern mongoose versions
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connect error', err);
    process.exit(1);
  }
};

module.exports = connectDB;
