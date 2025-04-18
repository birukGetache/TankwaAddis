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


const router = express.Router();

router.get("/", getAllDestinations);
router.get("/filtered", getDestinationsByLanguage);
router.get("/:id", getDestinationById);
router.post("/upload" ,uploads.single('image'), AddDestination)
router.delete("/:id", DeleteDestination)
router.put("/:id",uploads.single('image'), updateDestination)

module.exports = router;
