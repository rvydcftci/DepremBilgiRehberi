const InfoArticle = require('../models/infoArticle');

const infoController = {
    getInfo: async (req, res) => {
        try {
            const articles = await InfoArticle.find({ isActive: true })
                .sort({ category: 1, order: 1 });

            // Kategorilere göre makaleleri grupla
            const categorizedArticles = {
                önce: articles.filter(a => a.category === 'önce'),
                sırası: articles.filter(a => a.category === 'sırası'),
                sonrası: articles.filter(a => a.category === 'sonrası'),
                genel: articles.filter(a => a.category === 'genel')
            };

            res.render('info', {
                active: 'info',
                pageTitle: 'Bilgi Köşesi',
                articles: categorizedArticles
            });
        } catch (error) {
            console.error('Bilgi köşesi yüklenirken hata:', error);
            res.status(500).render('error', {
                message: 'Sayfa yüklenirken bir hata oluştu'
            });
        }
    },

    getArticleDetail: async (req, res) => {
        try {
            const article = await InfoArticle.findById(req.params.id);
            if (!article) {
                return res.status(404).render('error', {
                    message: 'Makale bulunamadı'
                });
            }

            // İlgili makaleleri getir
            const relatedArticles = await InfoArticle.find({
                category: article.category,
                _id: { $ne: article._id }
            }).limit(3);

            res.render('article-detail', {
                pageTitle: article.title,
                article,
                relatedArticles
            });
        } catch (error) {
            console.error('Makale detayı yüklenirken hata:', error);
            res.status(500).render('error', {
                message: 'Bir hata oluştu'
            });
        }
    },

    getInfoSection: async (req, res) => {
        try {
            const sectionId = req.params.sectionId;
            let content = '';
            let title = '';

            // Her bölüm için içerik tanımla
            switch(sectionId) {
                case 'deprem-cantasi':
                    title = 'Deprem Çantası Hazırlama';
                    content = `
                        <div class="info-content">
                            <h4>Deprem Çantasında Bulunması Gerekenler:</h4>
                            <ul class="checklist">
                                <li>Su (kişi başı 4 litre)</li>
                                <li>Kuru gıda ve konserve</li>
                                <li>El feneri ve yedek piller</li>
                                <li>İlk yardım malzemeleri</li>
                                <li>Önemli evrakların kopyaları</li>
                                <li>İlaçlar ve reçeteler</li>
                                <li>Hijyen malzemeleri</li>
                                <li>Şarj cihazı ve powerbank</li>
                                <li>Düdük</li>
                                <li>Yedek kıyafet</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'ev-guvenligi':
                    title = 'Ev Güvenliği';
                    content = `
                        <div class="info-content">
                            <h4>Ev Güvenliği İçin Yapılması Gerekenler:</h4>
                            <ul class="checklist">
                                <li>Dolap ve rafları duvara sabitleyin</li>
                                <li>Ağır eşyaları alt raflara yerleştirin</li>
                                <li>Acil çıkış planı hazırlayın</li>
                                <li>Gaz vanası ve elektrik şalterinin yerini öğrenin</li>
                                <li>Yangın söndürücü bulundurun</li>
                            </ul>
                        </div>
                    `;
                    break;
                // Diğer bölümler için benzer case'ler eklenebilir
            }

            res.json({
                success: true,
                data: {
                    title,
                    content
                }
            });
        } catch (error) {
            console.error('Bölüm yüklenirken hata:', error);
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu'
            });
        }
    },

    getAllArticles: async (req, res) => {
        try {
            const articles = await InfoArticle.find({ isActive: true })
                .select('title category shortDescription')
                .sort({ order: 1 });
            
            res.json({
                success: true,
                data: articles
            });
        } catch (error) {
            console.error('Makaleler yüklenirken hata:', error);
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu'
            });
        }
    },

    getArticleById: async (req, res) => {
        try {
            const article = await InfoArticle.findById(req.params.id);
            
            if (!article) {
                return res.status(404).json({
                    success: false,
                    message: 'Makale bulunamadı'
                });
            }
            
            res.json({
                success: true,
                data: article
            });
        } catch (error) {
            console.error('Makale yüklenirken hata:', error);
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu'
            });
        }
    }
};

module.exports = infoController; 