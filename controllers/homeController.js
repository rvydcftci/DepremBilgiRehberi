const Earthquake = require('../models/earthquake');

const homeController = {
    getHomePage: async (req, res) => {
        try {
            // Son 5 depremi getir
            const recentEarthquakes = await Earthquake.find()
                .sort({ date: -1 })
                .limit(5);

            res.render('home', {
                pageTitle: 'Ana Sayfa',
                earthquakes: recentEarthquakes,
                active: 'home'
            });
        } catch (error) {
            console.error('Ana sayfa yüklenirken hata:', error);
            res.status(500).render('error', {
                message: 'Bir hata oluştu'
            });
        }
    }
};

module.exports = homeController; 