module.exports.GetBoatOwner = async (req, res) => {
  try {
    const boatOwners = await BoatOwner.find();
    res.json(boatOwners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}