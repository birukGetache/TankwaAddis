const express = require('express');
const router = express.Router();
const { checkPromoCodeController } = require('../controllers/promoController');

router.post('/', checkPromoCodeController);

module.exports = router;
