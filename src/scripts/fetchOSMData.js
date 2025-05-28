const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Koordinatlardan adres bilgisi almak için yardımcı fonksiyon
const getLocationInfo = async (lat, lon) => {
  try {
    // API çağrıları arasında 1 saniye bekle (Nominatim kullanım politikası)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=tr`,
      {
        headers: {
          'User-Agent': 'DepremRehberi/1.0'
        }
      }
    );

    const address = response.data.address;
    return {
      city: address.city || address.province || address.state || 'Bilinmeyen',
      district: address.district || address.town || address.suburb || address.neighbourhood || 'Bilinmeyen'
    };
  } catch (error) {
    console.error(`Adres bilgisi alınamadı (${lat},${lon}):`, error.message);
    return { city: 'Bilinmeyen', district: 'Bilinmeyen' };
  }
};

const fetchOSMData = async () => {
  try {
    // OpenStreetMap Overpass API sorgusu
    const query = `
      [out:json][timeout:25];
      area["ISO3166-1"="TR"][admin_level=2]->.turkey;
      (
        node["emergency"="assembly_point"](area.turkey);
        way["emergency"="assembly_point"](area.turkey);
        relation["emergency"="assembly_point"](area.turkey);
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await axios.post('https://overpass-api.de/api/interpreter', 
      query, 
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    console.log('Veriler çekiliyor...');

    // Verileri dönüştür
    const elements = response.data.elements || [];
    const citiesMap = new Map();

    // Her element için konum bilgisini al
    for (const element of elements) {
      if (!element.tags) continue;

      const lat = element.lat || element.center?.lat;
      const lon = element.lon || element.center?.lon;

      if (!lat || !lon) continue;

      // Koordinatlardan şehir ve ilçe bilgisini al
      const locationInfo = await getLocationInfo(lat, lon);
      
      const city = locationInfo.city;
      const district = locationInfo.district;

      if (!citiesMap.has(city)) {
        citiesMap.set(city, {
          name: city,
          districts: new Map()
        });
      }

      const cityData = citiesMap.get(city);
      if (!cityData.districts.has(district)) {
        cityData.districts.set(district, {
          name: district,
          safeZones: []
        });
      }

      const safeZone = {
        name: element.tags.name || `Toplanma Alanı ${element.id}`,
        location: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        capacity: parseInt(element.tags.capacity) || 1000,
        source: 'OpenStreetMap',
        facilities: [
          element.tags.amenity,
          element.tags.emergency,
          element.tags.shelter_type
        ].filter(Boolean),
        contactInfo: {
          phone: element.tags.phone || '',
          email: element.tags.email || ''
        }
      };

      cityData.districts.get(district).safeZones.push(safeZone);
      
      // İlerleme durumunu göster
      console.log(`İşleniyor: ${elements.indexOf(element) + 1}/${elements.length}`);
    }

    // Map'ten array'e çevir
    const safeZones = {
      cities: Array.from(citiesMap.values()).map(city => ({
        name: city.name,
        districts: Array.from(city.districts.values())
      }))
    };

    // JSON dosyasına kaydet
    await fs.writeFile(
      path.join(__dirname, '../data/safeZones.json'),
      JSON.stringify(safeZones, null, 2)
    );

    console.log('Veriler başarıyla çekildi ve kaydedildi');
    
    // İstatistikleri göster
    console.log('\nİstatistikler:');
    console.log('Toplam Şehir Sayısı:', safeZones.cities.length);
    console.log('Toplam Toplanma Alanı Sayısı:', elements.length);
    safeZones.cities.forEach(city => {
      console.log(`\n${city.name}:`);
      city.districts.forEach(district => {
        console.log(`  ${district.name}: ${district.safeZones.length} toplanma alanı`);
      });
    });

  } catch (error) {
    console.error('Veri çekme hatası:', error);
    if (error.response) {
      console.error('API Yanıt Detayları:', error.response.data);
    }
  }
};

fetchOSMData(); 