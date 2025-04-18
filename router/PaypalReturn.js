const {paymentReturn} = require('../controllers/paypalReturn')
const express = require('express');
const router = express.Router();
router.post("/", paymentReturn)
module.exports = router;
