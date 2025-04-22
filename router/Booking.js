const {GetSpecificBook , GetAllBook} = require('../controllers/Booking')
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.js');


router.get("/:id", GetSpecificBook)
router.get("/", verifyToken, GetAllBook)
module.exports = router;
