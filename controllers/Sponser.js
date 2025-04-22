const Sponsers = require("../models/Sponser")
const Destination = require("../models/Destination")
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'drpuygxkj', 
  api_key: '862122525455791', 
  api_secret: '7c5LGGeCw9tSMEkQK4oqu4bbd2A' // Click 'View API Keys' above to copy your API secret
});
const Sponser = async (req, res) => {
  const { id } = req.params;
  const { name, url, description, twitter, facebook, instagram } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : undefined; // Only update logo if a new file is uploaded

  try {
    const updatedSponsor = await Sponsers.findByIdAndUpdate(
      id,
      { name, logo, url, description, twitter, facebook, instagram },
      { new: true }
    );
    res.json(updatedSponsor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
}
const DeleteSponsers =  async (req, res) => {
    const { id } = req.params;
    try {
      await Sponsers.findByIdAndDelete(id);
      res.json({ message: 'Sponsor deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete sponsor' });
    }
  }

  const GetAllSponser =   async (req, res) => {
    ("her")
    try {
      const sponsors = await Sponsers.find();
      res.json(sponsors);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch sponsors' });
    }
  }

  const UploadPost =  async (req, res) => {
    const { name, url, description, twitter, facebook, instagram } = req.body;
     (req.body)
    try {
      let uploadResult;
      if (req.file) {
        try {
          ('Uploading to Cloudinary...');
          
          // Attempt to upload the file to Cloudinary
           uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'sponsors', // Optional: specify a folder in Cloudinary
          });
          
          // Log the result if successful
          ('Cloudinary Upload Success:', uploadResult);
          
        } catch (error) {
          // Log the error if the upload fails
          console.error('Cloudinary Upload Failed:', error.message);
        }
      }
      
      (uploadResult.public_id)
  
      const newSponsor = new Sponsers({
        name,
        logo: uploadResult ? uploadResult.secure_url : '', // Use the Cloudinary URL
        public_id: uploadResult.public_id,
        url,
        description,
        twitter,
        facebook,
        instagram,
      });
  

      ('Saving Sponsor to Database...');
      await newSponsor.save();
      ('Sponsor Saved:', newSponsor);
  
      res.status(201).json(newSponsor);
    } catch (err) {
      console.error('Error in /sponser route:', err); // Log the full error
      res.status(500).json({ error: 'Failed to create sponsor', details: err.message });
    }
  }

  const UploadPostReal = async (req, res) => {
    (req.body);
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uploads'
      });
  
      // Parse titles and descriptions from the request body
      const titles = JSON.parse(req.body.titles); // Expecting a JSON string
      const descriptions = JSON.parse(req.body.descriptions); // Expecting a JSON string
  
      const newDestination = await Destination.create({
        image: result.secure_url,
        titles, // Store titles as an object
        descriptions // Store descriptions as an object
      });
  
      res.status(201).json({
        titles: newDestination.titles,
        descriptions: newDestination.descriptions,
        imageUrl: newDestination.image
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
 const UpdateSponser = async (req, res) => {

    const { id } = req.params;
    (id)
    const {  public_id  } = req.body;
    const {name, url, description, twitter, facebook, instagram , logo} = req.body;
  (req.body)
  let uploadResult;
    if (req.file) {
      try {
        cloudinary.uploader.destroy(public_id);
        ('Uploading to Cloudinary...');
        
        // Attempt to upload the file to Cloudinary
         uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'sponsors', // Optional: specify a folder in Cloudinary
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
      (name)
      const updatedSponsor = await Sponsers.findByIdAndUpdate(
      
        id,
        { name,  logo: uploadResult ? uploadResult.secure_url : logo, url, description, twitter, facebook, instagram , public_id },
        { new: true }
      );
      (updatedSponsor)
      res.json(updatedSponsor);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update sponsor' });
    }
  }

  module.exports = {
    Sponser,
    DeleteSponsers,
    GetAllSponser,
    UploadPost,
    UploadPostReal,
    UpdateSponser
  }