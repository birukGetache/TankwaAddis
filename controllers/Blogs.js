const Blog = require("../models/Blog")
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'drpuygxkj', 
  api_key: '862122525455791', 
  api_secret: '7c5LGGeCw9tSMEkQK4oqu4bbd2A' // Click 'View API Keys' above to copy your API secret
});
const BlogPost =    async (req, res) => {
  const { title, description } = req.body;

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogs', // Optional: Organize images in a folder
    });

    // Create a new blog post with the Cloudinary image URL
    const newBlog = new Blog({
      title,
      description,
      public_id:uploadResult.public_id,
      imageUrl: uploadResult.secure_url, // Use the secure URL from Cloudinary
    });

    // Save the blog post to the database
    await newBlog.save();

    // Respond with the created blog post
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
}
const Blogs = async (req, res) => {
    try {
      const blogs = await Blog.find(); // Fetch all blogs from MongoDB
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  }

  const EditBlog  = async (req, res) => {
  
      const { id } = req.params;
      (id)
      const {  public_id  } = req.body;
      (req.body)
      const {title, description, image:imageUrl} = req.body;

    let uploadResult;
      if (req.file) {
        try {
          cloudinary.uploader.destroy(public_id);
          ('Uploading to Cloudinary...');
          
          // Attempt to upload the file to Cloudinary
           uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'Blogs', // Optional: specify a folder in Cloudinary
          });
          public_id = uploadResult.public_id
          // Log the result if successful
          ('Cloudinary Upload Success:', uploadResult);
          
        } catch (error) {
          // Log the error if the upload fails
          console.error('Cloudinary Upload Failed:', error.message);
        }
      }
      try {

       
        const updateBlog = await Blog.findByIdAndUpdate(
        
          id,
          { title,  imageUrl: uploadResult ? uploadResult.secure_url : imageUrl , description ,public_id  },
          { new: true }
        );
        ("updated blogs")
        (updateBlog)
        res.json(updateBlog);
      } catch (err) {
        (err)
        res.status(500).json({ error: 'Failed to update Blogs' });
      }
    }

    const DeleteBlog = async (req, res)=>{
      const { id } = req.params;
          try {
            await Blog.findByIdAndDelete(id);
            res.json({ message: 'Blog deleted successfully' });
          } catch (err) {
            res.status(500).json({ error: 'Failed to delete sponsor' });
          }
    }
    const Like =  async (req, res) => {
      try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
    
        blog.likes += 1;
        await blog.save();
        res.json(blog);
      } catch (error) {
        res.status(500).json({ error: "Failed to like the blog post" });
      }
    }
    const Comments = async (req, res) => {
      try {
        const { comment } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
    
        blog.comments.push(comment);
        await blog.save();
        res.json(blog);
      } catch (error) {
        (error)
        res.status(500).json({ error: "Failed to add comment" });
      }
    }
  module.exports = {
    BlogPost,
    Blogs,
    EditBlog,
    DeleteBlog,
    Like,
    Comments
  }