module.exports.UpdateDestinations = async (req, res) => {
  try {
      const destination = await Destination.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
      );
      res.json(destination);
  } catch (error) {
      res.status(500).send(error);
  }
}