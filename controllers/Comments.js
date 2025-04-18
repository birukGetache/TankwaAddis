  module.exports.Comments = async (req, res) => {
  try {
    const { comment } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.comments.push(comment);
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
}