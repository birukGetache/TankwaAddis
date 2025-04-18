module.exports.TempBlogs =  async (req, res) => {
  try {
    const blogs = await User.find(); // Fetch all blogs from MongoDB
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
}