const { BlogPost, Blogs , EditBlog , DeleteBlog } = require('../controllers/Blogs');
const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware'); // Ensure you are importing the right one

// Define your routes
router.get("/", Blogs);
router.post('/', upload.single('image'), BlogPost);  // Corrected this line
router.put("/:id",upload.single('image'),EditBlog);
router.delete("/:id",DeleteBlog)

module.exports = router;
