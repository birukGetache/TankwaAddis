
const {
    Sponser,
    DeleteSponsers,
    GetAllSponser,
    UploadPost,
    UploadPostReal,
    UpdateSponser
  } = require("../controllers/Sponser")
  const { upload } = require('../middleware/uploadMiddleware'); // Ensure you are importing the right one

const express = require('express');
const router = express.Router();

// Import multer upload middleware


// Define your routes
router.get("/",  GetAllSponser)
router.post("/", upload.single('logo'), UploadPost )
router.delete("/:id" , DeleteSponsers)
router.put("/:id",upload.single('logo'),UpdateSponser)
// router.post("/realupload" ,  uploads.single('image') , UploadPostReal)
module.exports = router;
