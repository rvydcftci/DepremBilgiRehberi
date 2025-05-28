const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const SafeZone = require('../models/SafeZone');
require('dotenv').config();

const generateUniqueId = (city, district, name, coordinates) => {
  const lat = coordinates[1].toFixed(6);
  const lon = coordinates[0].toFixed(6);
  return `${city}-${district}-${lat}-${lon}`.toLowerCase().replace(/\s+/g, '-');
};

const generateUniqueName = (baseName, coordinates) => {
  const lat = coordinates[1].toFixed(6);
  const lon = coordinates[0].toFixed(6);
  return `${baseName} (${lat}, ${lon})`;
};

const importToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('MongoDB Atlas\'a bağlanıldı');

    const rawData = await fs.readFile(
      path.join(__dirname, '../data/safeZones.json'),
      'utf-8'
    );
    const data = JSON.parse(rawData);

    await SafeZone.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    let totalImported = 0;
    for (const city of data.cities) {
      for (const district of city.districts) {
        const safeZonePromises = district.safeZones.map(zone => {
          const modifiedZone = {
            ...zone,
            name: generateUniqueName(zone.name, zone.location.coordinates),
            uniqueId: generateUniqueId(
              city.name, 
              district.name, 
              zone.name, 
              zone.location.coordinates
            ),
            source: zone.source === 'OpenStreetMap' ? 'community' : zone.source,
            city: city.name,
            district: district.name,
            status: 'active',
            lastUpdated: new Date()
          };
          return SafeZone.create(modifiedZone);
        });

        try {
          await Promise.all(safeZonePromises);
          totalImported += district.safeZones.length;
          console.log(`${city.name} - ${district.name}: ${district.safeZones.length} toplanma alanı eklendi`);
        } catch (error) {
          console.error(`Hata (${city.name} - ${district.name}):`, error.message);
          continue;
        }
      }
    }

    console.log('\nAktarım tamamlandı:');
    console.log(`Toplam ${data.cities.length} şehir`);
    console.log(`Toplam ${totalImported} toplanma alanı aktarıldı`);

    await mongoose.connection.close();
    console.log('Veritabanı bağlantısı kapatıldı');

  } catch (error) {
    console.error('Aktarım hatası:', error);
    process.exit(1);
  }
};

importToMongoDB(); 