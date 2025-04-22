const express = require('express');
const {
  getAllDestinations,
  getDestinationsByLanguage,
  getDestinationById,
  AddDestination,
  DeleteDestination,
  updateDestination
} = require('../controllers/Destinations');

const { uploads } = require('../middleware/uploadMiddleware'); // Ensure you are importing the right one

const verifyToken = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get("/", getAllDestinations);
router.get("/filtered", getDestinationsByLanguage);
router.get("/:id", getDestinationById);
router.post("/upload" ,verifyToken ,uploads.single('image'), AddDestination)
router.delete("/:id",verifyToken, DeleteDestination)
router.put("/:id",verifyToken ,uploads.single('image'), updateDestination)

module.exports = router;
