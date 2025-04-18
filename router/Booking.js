const {GetSpecificBook , GetAllBook} = require('../controllers/Booking')
const express = require('express');
const router = express.Router();


router.get("/:id", GetSpecificBook)
router.get("/",GetAllBook)
module.exports = router;
