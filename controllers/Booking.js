const {generatePromocode} = require("../services/promocodeGenerator")
const Book = require("../models/bookingSchema")
const Promocode = require("../models/promoCode")
const GetSpecificBook = async (req, res) => {
  try {
    // Find booking by ID and populate boatOwner details
    const booking = await Book.findById(req.params.id).populate({
      path: 'boatOwner',
      select: 'name fatherName phone', // Only selecting specific fields
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Generate a unique promocode
    let code;
    let promocodeExists = true;

    // Ensure promocode is unique
    while (promocodeExists) {
      code = generatePromocode();
      promocodeExists = await Promocode.findOne({ code });
    }

    // Create and save the promocode to the database
    const promocode = new Promocode({
      code,
      discount: 10, // Example discount value, can be dynamic
      expiryDate: new Date('2025-12-31'), // Example expiration date
    });

    await promocode.save();

    // Send the booking details, boatOwner details, and promocode
    res.json({
      bookingDetails: booking,
      boatOwnerDetails: booking.boatOwner,
      promocodeDetails: promocode,
    });
  } catch (error) {
    console.error('Error fetching booking and generating promocode:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
const GetAllBook = async (req, res) => {
  ("we are reach")
  try {
    // Fetch all bookings and populate the boatOwner details
    const bookings = await Book.find()// Only include specific fields

    // Check if bookings exist
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    // Return the bookings
    res.status(200).json(bookings);
    (bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
}
module.exports = {GetSpecificBook, GetAllBook};