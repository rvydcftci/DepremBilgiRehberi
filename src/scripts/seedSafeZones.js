const mongoose = require('mongoose');
const SafeZone = require('../models/SafeZone');
require('dotenv').config();

const turkiyeSehirleri = [
  {
    sehir: "İstanbul",
    coordinates: [41.0082, 28.9784],
    safeZones: [
      {
        name: "Yenikapı Miting Alanı",
        location: {
          type: "Point",
          coordinates: [28.9550, 41.0023]
        },
        capacity: 500000,
        source: "municipality",
        facilities: ["Tuvalet", "Su", "İlk Yardım"],
        contactInfo: {
          phone: "112",
          email: "yenikapi@istanbul.bel.tr"
        }
      },
      // Diğer güvenli alanlar...
    ]
  },
  {
    sehir: "Ankara",
    coordinates: [39.9334, 32.8597],
    safeZones: [
      {
        name: "Atatürk Kültür Merkezi",
        location: {
          type: "Point",
          coordinates: [32.8662, 39.9334]
        },
        capacity: 300000,
        source: "AFAD",
        facilities: ["Tuvalet", "Su", "Çadır Alanı"],
        contactInfo: {
          phone: "112",
          email: "akm@ankara.bel.tr"
        }
      }
    ]
  },
  // Diğer şehirler...
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('MongoDB Atlas\'a bağlanıldı');

    // Mevcut verileri temizle
    await SafeZone.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    // Her şehir için güvenli bölgeleri ekle
    for (const sehir of turkiyeSehirleri) {
      const safeZonePromises = sehir.safeZones.map(zone => {
        return SafeZone.create({
          ...zone,
          city: sehir.sehir,
          status: 'active',
          lastUpdated: new Date()
        });
      });

      await Promise.all(safeZonePromises);
      console.log(`${sehir.sehir} güvenli bölgeleri eklendi`);
    }

    console.log('Tüm veriler başarıyla eklendi');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

seedDatabase(); 