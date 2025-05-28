const Redis = require('redis');
const client = Redis.createClient();

const cacheSafeZoneData = async (key, data, expireTime = 3600) => {
  try {
    await client.setEx(key, expireTime, JSON.stringify(data));
  } catch (error) {
    console.error('Cache hatası:', error);
  }
};

const getCachedSafeZoneData = async (key) => {
  try {
    const cachedData = await client.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Cache okuma hatası:', error);
    return null;
  }
}; 