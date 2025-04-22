const TempBooking = require("../models/TempBooking")
const Booking = require("../models/bookingSchema")
const BoatOwner = require("../models/BoatOwner")
module.exports.paymentReturn = async (req, res) => {
    try {
        const { tempBookingId, message } = req.body;
    ("tempBookingId"+tempBookingId)
        // Step 1: Verify the payment with PayPal
  
        if (message === 'Payment Approved') {
            // Step 2: Retrieve the temporary booking data
            const tempBooking = await TempBooking.findById(tempBookingId);
            if (!tempBooking) {
                throw new Error('Temporary booking data not found');
            }
  
            // Step 3: Fetch all BoatOwners and compare their rounds
            const boatOwners = await BoatOwner.find();
            const minRound = Math.min(...boatOwners.map(owner => owner.round));
            const candidates = boatOwners.filter(owner => owner.round === minRound);
            const selectedBoatOwner = candidates[Math.floor(Math.random() * candidates.length)];
  
            if (selectedBoatOwner.size > 60) {
                selectedBoatOwner.round += 1;
            } else {
                selectedBoatOwner.size += tempBooking.numberOfPassengers;
            }
            await selectedBoatOwner.save();
  
            // Step 4: Create a new booking and associate the selected BoatOwner
            const newBooking = new Booking({
                ...tempBooking.toObject(),
                boatOwner: selectedBoatOwner._id,
            });
            const savedBooking = await newBooking.save();
  
            // Step 5: Delete the temporary booking data
            await TempBooking.deleteOne({ _id: tempBookingId });
  
            // Step 6: Respond to the client with the booking details
            res.status(201).json({
                message: "Booking created successfully",
                booking: savedBooking,
                return_url: `https://tankwa.vercel.app/congratulation/${savedBooking._id}`,
            });
        } else {
            throw new Error('Payment not approved');
        }
    } catch (error) {
        ("Error handling PayPal return:", error);
        res.status(500).json({ error: error.message });
    }
  }