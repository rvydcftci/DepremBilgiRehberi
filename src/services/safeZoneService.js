const SafeZone = require('../models/SafeZone');

const getSafeZoneService = {
  // Şehre göre güvenli bölgeleri getir
  getByCityName: async (cityName) => {
    try {
      const safeZones = await SafeZone.find({ 
        city: cityName,
        status: 'active'
      });
      return safeZones;
    } catch (error) {
      throw new Error(`${cityName} için güvenli bölgeler getirilirken hata: ${error.message}`);
    }
  },

  // Belirli bir koordinat etrafındaki güvenli bölgeleri getir
  getNearby: async (longitude, latitude, maxDistance = 5000) => {
    try {
      const safeZones = await SafeZone.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance // metre cinsinden
          }
        },
        status: 'active'
      });
      return safeZones;
    } catch (error) {
      throw new Error(`Yakındaki güvenli bölgeler getirilirken hata: ${error.message}`);
    }
  },

  // Kapasite bazlı filtreleme
  getByMinCapacity: async (minCapacity) => {
    try {
      const safeZones = await SafeZone.find({
        capacity: { $gte: minCapacity },
        status: 'active'
      });
      return safeZones;
    } catch (error) {
      throw new Error(`Kapasite bazlı sorgulama hatası: ${error.message}`);
    }
  }
};

module.exports = getSafeZoneService; 