module.exports.Favorites =  async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.isFavorite = !blog.isFavorite;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update favorite state" });
  }
}