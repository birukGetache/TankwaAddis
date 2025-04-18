const {GetBoatOwner , PostBoatOwner , DeleteBoatOwner , UpdateBoatOwner , UpdateAvailability}  = require('../controllers/BoatOwner')
const express = require('express');
const router = express.Router();


router.get("/", GetBoatOwner)
router.post("/"  , PostBoatOwner)
router.put("/:id",UpdateBoatOwner)
router.delete("/:id", DeleteBoatOwner)
router.put('/availability/:id' , UpdateAvailability)
module.exports = router;
