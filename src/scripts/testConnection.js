require('dotenv').config();
const mongoose = require('mongoose');

console.log('Bağlantı URI:', process.env.MONGODB_ATLAS_URI);

mongoose.connect(process.env.MONGODB_ATLAS_URI)
  .then(() => {
    console.log('MongoDB\'ye başarıyla bağlandı!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Bağlantı hatası:', err);
    process.exit(1);
  }); 