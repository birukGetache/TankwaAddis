const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  device: String,
  browser: String,
  _id:String,
  location: String,
  ip: String,
  timestamp: Date
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
