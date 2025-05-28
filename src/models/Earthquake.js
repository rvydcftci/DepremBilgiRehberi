const mongoose = require('mongoose');

// Model zaten tanımlı mı diye kontrol et
if (mongoose.models.Earthquake) {
    module.exports = mongoose.models.Earthquake;
} else {
    const earthquakeSchema = new mongoose.Schema({
        date: {
            type: Date,
            required: true
        },
        magnitude: {
            type: Number,
            required: true
        },
        depth: {
            type: Number,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String
        },
        neighborhood: String,
        source: {
            type: String,
            default: 'AFAD'
        }
    }, {
        timestamps: true
    });

    // Lokasyon bazlı sorgular için index
    earthquakeSchema.index({ location: '2dsphere' });

    module.exports = mongoose.model('Earthquake', earthquakeSchema);
} 