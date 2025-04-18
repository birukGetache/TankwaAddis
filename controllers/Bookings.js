
module.exports.Bookings =async (req, res) => {
  try {
    // Fetch all bookings and populate the boatOwner details
    const bookings = await Booking.find()// Only include specific fields

    // Check if bookings exist
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    // Return the bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
}