const express = require('express');
const router = express.Router();
const path = require('path');
const SafeZone = require('../src/models/SafeZone');

// Controllers
const homeController = require('../controllers/homeController');
const earthquakeController = require('../controllers/earthquakeController');
const safeZoneController = require('../controllers/safeZoneController');
const infoController = require('../controllers/infoController');

// Ana sayfa
router.get('/', (req, res) => {
    res.render('home', {
        active: 'home'
    });
});

// Son Depremler sayfası
router.get('/son-depremler', (req, res, next) => {
    req.active = 'earthquakes';
    next();
}, earthquakeController.getEarthquakes);

// Güvenli Bölge sayfası
router.get('/guvenli-bolge', (req, res, next) => {
    req.active = 'safezone';
    next();
}, safeZoneController.getSafeZones);

// Bilgi Köşesi sayfası
router.get('/bilgi-kosesi', (req, res, next) => {
    req.active = 'info';
    next();
}, infoController.getInfo);

// Bilgi Köşesi detay sayfası
router.get('/bilgi-kosesi/:id', infoController.getArticleDetail);

// API endpoints
router.get('/api/nearest-safe-zones', safeZoneController.getNearestSafeZones);
router.get('/api/districts/:city', safeZoneController.getDistrictsByCity);

// Bilgi Köşesi bölüm detayı
router.get('/api/info-section/:sectionId', infoController.getInfoSection);

// API endpoints
router.get('/api/info-articles', infoController.getAllArticles);
router.get('/api/info-articles/:id', infoController.getArticleById);

// PDF dosyaları için route
router.get('/docs/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../public/docs', filename);
    res.download(filePath);
});

// API endpoint'i ekle
router.get('/api/safe-zones', async (req, res) => {
    try {
        console.log('Safe zones API endpoint çağrıldı');
        const safeZones = await SafeZone.find({})
            .select('uniqueId name city district location capacity')
            .sort({ city: 1, district: 1 });
            
        console.log('Bulunan güvenli bölge sayısı:', safeZones.length);
        res.json(safeZones);
    } catch (error) {
        console.error('Güvenli bölgeler getirilirken detaylı hata:', error);
        console.error('Hata stack:', error.stack);
        res.status(500).json({ 
            error: 'Güvenli bölgeler yüklenirken bir hata oluştu',
            details: error.message 
        });
    }
});

module.exports = router; 