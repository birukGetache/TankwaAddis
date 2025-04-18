module.exports.Like =  async (req, res) => {
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