const mongoose = require('mongoose');
const SafeZone = require('../models/SafeZone');
require('dotenv').config();

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('MongoDB\'ye bağlanıldı');

    await SafeZone.collection.createIndex({ uniqueId: 1 }, { unique: true });
    await SafeZone.collection.createIndex({ location: '2dsphere' });
    await SafeZone.collection.createIndex({ city: 1 });
    await SafeZone.collection.createIndex({ district: 1 });

    console.log('İndexler başarıyla oluşturuldu');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

createIndexes(); 