const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const SafeZone = require('../models/SafeZone');
require('dotenv').config();

const importSafeZones = async () => {
  try {
    // MongoDB Atlas'a bağlan
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('MongoDB Atlas\'a bağlanıldı');

    // JSON dosyasını oku
    const rawData = await fs.readFile(
      path.join(__dirname, '../data/safeZones.json'),
      'utf-8'
    );
    const data = JSON.parse(rawData);

    // Mevcut verileri temizle
    await SafeZone.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    // Her şehir için güvenli bölgeleri ekle
    for (const city of data.cities) {
      for (const district of city.districts) {
        const safeZonePromises = district.safeZones.map(zone => {
          return SafeZone.create({
            ...zone,
            city: city.name,
            district: district.name,
            status: 'active',
            lastUpdated: new Date()
          });
        });

        await Promise.all(safeZonePromises);
        console.log(`${city.name} - ${district.name} güvenli bölgeleri eklendi`);
      }
    }

    console.log('Tüm veriler başarıyla aktarıldı');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

importSafeZones(); 