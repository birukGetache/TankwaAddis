const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');

// ✅ Now this works, because it's a function
router.post("/", sessionController);

module.exports = router;
