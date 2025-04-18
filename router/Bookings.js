const Payment = require('../controllers/paypalReturn')
const express = require('express');
const router = express.Router();

// Import multer upload middleware


// Define your routes
router.get("/Bookings", Payment)
module.exports = router;
