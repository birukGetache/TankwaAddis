const {GetBoatOwner , PostBoatOwner , DeleteBoatOwner , UpdateBoatOwner , UpdateAvailability , authLogin , getBookingStats ,getEarningsStats , monthStats , getBookingsByBoatOwner , getAll , GetAvailability}  = require('../controllers/BoatOwner')
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.js');
const { uploadImage } = require('../middleware/uploadMiddleware'); 

router.get("/", GetBoatOwner)
router.post("/"  ,verifyToken,uploadImage.single("image"), PostBoatOwner)
router.put("/:id",verifyToken,uploadImage.single("image"),UpdateBoatOwner)
router.delete("/:id",verifyToken, DeleteBoatOwner)
router.post("/login",authLogin)
router.post("/booking",getBookingStats)
router.post("/earning",getEarningsStats)
router.post("/month/:boatOwnerId" , monthStats)
router.post("/get/:boatOwnerId",getBookingsByBoatOwner)
router.post("/getall/:boatOwnerId",getAll)
router.put('/availability/:id' , UpdateAvailability)
router.get('/availability/:id' , GetAvailability)
module.exports = router;
