const {payment} = require('../controllers/Payment')
const express = require('express');
const router = express.Router();
router.post("/", payment)
module.exports = router;
