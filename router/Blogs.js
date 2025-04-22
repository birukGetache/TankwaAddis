const { BlogPost, Blogs , EditBlog , DeleteBlog , Like , Comments} = require('../controllers/Blogs');
const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware'); // Ensure you are importing the right one
const verifyToken = require('../middleware/authMiddleware.js');

// Define your routes
router.get("/", Blogs);
router.post('/',verifyToken, upload.single('image'), BlogPost);  // Corrected this line
router.put("/:id",verifyToken ,upload.single('image'),EditBlog);
router.delete("/:id",verifyToken ,DeleteBlog)
router.post("/:id/like", Like);
router.post("/:id/comments" , Comments);
module.exports = router;
