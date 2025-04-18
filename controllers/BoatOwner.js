const BoatOwner = require("../models/BoatOwner")
const PostBoatOwner =  async (req, res) => {
  try {
    const { name, fatherName, middleName, phone } = req.body;
    const newBoatOwner = new BoatOwner({ name, fatherName, middleName, phone });
    await newBoatOwner.save();
    res.status(201).json(newBoatOwner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const GetBoatOwner = async (req, res) => {
  try {
    const boatOwners = await BoatOwner.find();
    res.json(boatOwners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const DeleteBoatOwner =  async (req, res) => {
  try {
    await BoatOwner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Boat Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const UpdateBoatOwner = async (req, res) => {
  try {
    const updatedOwner = await BoatOwner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOwner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const UpdateAvailability = async (req, res) =>{
  const {availability} = req.body;
  const updatedOwner = await BoatOwner.findByIdAndUpdate(req.params.id, {availability}, {new: true})
}
module.exports = {
  PostBoatOwner,
  GetBoatOwner,
  DeleteBoatOwner,
  UpdateBoatOwner,
  UpdateAvailability
}