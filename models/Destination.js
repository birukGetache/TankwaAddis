const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    titles: {
        type: Map, // Use a Map to store titles for different languages
        of: String, // Values are strings
        default: {} // Default to an empty object
    },
    descriptions: {
        type: Map, // Use a Map to store descriptions for different languages
        of: String, // Values are strings
        default: {} // Default to an empty object
    },
    image: String, // Image remains a single string
    public_id:String,
    price: Number,
});

module.exports = mongoose.model('Destination', destinationSchema);