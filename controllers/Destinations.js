const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const cloudinary = require('cloudinary').v2;
const { isValidObjectId, Types } = require('mongoose');
const getAllDestinations = async (req, res) => {
  ("we are here ok");
  try {
    const destinations = await Destination.find();
    ("destinaions", destinations);
    res.json(destinations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDestinationsByLanguage = async (req, res) => {
  const { language } = req.query; 
  try {
    const destinations = await Destination.find();
    const filteredDestinations = destinations.map((destination) => ({
      _id: destination._id,
      title: destination.titles[language] || 'No Title',
      description: destination.descriptions[language] || 'No Description',
      image: destination.image
    }));
    res.json(filteredDestinations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDestinationById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const AddDestination =  async (req, res) => {
  (req.body);
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads'
    });

    (result)
    // Parse titles and descriptions from the request body
    const titles = JSON.parse(req.body.titles); // Expecting a JSON string
    const descriptions = JSON.parse(req.body.descriptions); // Expecting a JSON string
    const price = JSON.parse(req.body.price)
  ("I am looking for it")
    const newDestination = await Destination.create({
      image: result.secure_url,
      titles, 
      descriptions, 
      price,
      public_id:result.public_id
    });

    res.status(201).json({
      titles: newDestination.titles,
      descriptions: newDestination.descriptions,
      imageUrl: newDestination.image
    });
  } catch (error) {
    (error)
    res.status(500).send(error);
  }
}
const updateDestination = async (req, res) => {
  console.log("hellowee e")
  const { id } = req.params;
  let { public_id, image, titles, descriptions } = req.body;

  // Parse titles and descriptions
  try {
    titles = JSON.parse(titles);
    descriptions = JSON.parse(descriptions);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON in titles or descriptions' });
  }
  let objectId;
  const cleanId = id.toString().trim();
  if (!isValidObjectId(cleanId)) {
    return res.status(400).json({ 
      error: 'Invalid destination ID format',
      details: `ID "${cleanId}" is not a valid ObjectId`
    });
  }
  try {
    objectId = Types.ObjectId.createFromHexString(cleanId);
  } catch (err) {
    console.log(err)
    return res.status(400).json({ 
      error: 'Invalid destination ID format',
      details: `ID "${id}" cannot be cast to ObjectId`
    });
  }

  // 3. Verify the destination exists first
  const existingDestination = await Destination.findById(objectId);
  if (!existingDestination) {
    console.log("we are there")
    return res.status(404).json({ error: 'Destination not found' });
  }
  let uploadResult;

  if (req.file) {
    try {
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }

      ('Uploading to Cloudinary...');
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Destination',
      });

      image = uploadResult.secure_url;
      public_id = uploadResult.public_id;

      console.log('Cloudinary Upload Success:', uploadResult);
    } catch (error) {
      console.error('Cloudinary Upload Failed:', error.message);
    }
  }

  try {
    console.log("we are here")
    const updateBlog = await Destination.findByIdAndUpdate(
      id,
      {
        image,
        titles,        // Proper object now
        descriptions,  // Proper object now
        public_id
      },
      { new: true }
    );

    ('Updated destination:', updateBlog);
    res.json(updateBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update destination' });
  }
};


const DeleteDestination =  async (req, res) => {
  try {
      await Destination.findByIdAndDelete(req.params.id);
      res.status(204).send();
  } catch (error) {
      res.status(500).send(error);
  }
}
// ✅ Correctly export all functions
module.exports = {
  getAllDestinations,
  getDestinationsByLanguage,
  getDestinationById,
  AddDestination,
  DeleteDestination,
  updateDestination
};
