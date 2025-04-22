const BoatOwner = require("../models/BoatOwner")
const path = require("path")
const Booking = require("../models/bookingSchema")
const mongoose = require("mongoose")
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'drpuygxkj', 
  api_key: '862122525455791', 
  api_secret: '7c5LGGeCw9tSMEkQK4oqu4bbd2A' // Click 'View API Keys' above to copy your API secret
});
const PostBoatOwner =  async (req, res) => {
  try {
    const { name, fatherName, middleName, phone } = req.body;
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'boatOwner', // Optional: Organize images in a folder
    });
    const newBoatOwner = new BoatOwner({ name, fatherName, middleName, phone , imageUrl: uploadResult.secure_url,});
    await newBoatOwner.save();
    res.status(201).json(newBoatOwner);
  } catch (error) {
    (error)
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
console.log("hellow we are here")
  try {
    const { id } = req.params;
    const { name, fatherName, middleName, phone } = req.body;
    let updatedData = { name, fatherName, middleName, phone };

    // Check if a file is uploaded
    if (req.file) {
      const imageUrl = await await cloudinary.uploader.upload(req.file.path, {
        folder: 'boatOwner', // Optional: Organize images in a folder
      });// or however you're uploading
      updatedData.imageUrl =  imageUrl.secure_url;
    }

    const updatedOwner = await BoatOwner.findByIdAndUpdate(id, updatedData, { new: true });

    res.json(updatedOwner);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const authLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await BoatOwner.findOne({ name:username, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(user); // For debugging
    res.status(200).json({ message: 'Login successful', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAll = async (req, res) => {
  const { boatOwnerId } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(boatOwnerId)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid Boat Owner ID' 
    });
  }

  try {
    // Find all bookings for this boat owner
    const bookings = await Booking.find({ 
      boatOwner: new mongoose.Types.ObjectId(boatOwnerId) 
    })
    .sort({ preferredDate: -1 }) // Sort by preferred date (newest first)
    .lean(); // Convert to plain JavaScript objects

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No bookings found for this boat owner' 
      });
    }

    // Format the response data
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      formattedDate: new Date(booking.preferredDate).toLocaleDateString(),
      formattedCreatedAt: new Date(booking.createdAt).toLocaleString(),
      passengerName: `${booking.firstName} ${booking.lastName}`,
      amountWithCurrency: booking.currency === 'ETB' 
        ? `ብር ${booking.amount.toLocaleString()}` 
        : `$${booking.amount.toLocaleString()}`
    }));

    res.status(200).json({ 
      success: true,
      count: bookings.length,
      data: formattedBookings 
    });

  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
const getBookingStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    // Yesterday
    const startOfYesterday = new Date(today);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    // This week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Last week
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(endOfWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 7);

    // This month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Last month
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    const [
      bookingsToday,
      bookingsYesterday,
      bookingsThisWeek,
      bookingsLastWeek,
      bookingsThisMonth,
      bookingsLastMonth,
    ] = await Promise.all([
      Booking.find({ createdAt: { $gte: today, $lte: endOfToday } }),
      Booking.find({ createdAt: { $gte: startOfYesterday, $lte: endOfYesterday } }),
      Booking.find({ createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
      Booking.find({ createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek } }),
      Booking.find({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Booking.find({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    ]);

    res.status(200).json({
      todayCount: bookingsToday.length,
      yesterdayCount: bookingsYesterday.length,
      weekCount: bookingsThisWeek.length,
      lastWeekCount: bookingsLastWeek.length,
      monthCount: bookingsThisMonth.length,
      lastMonthCount: bookingsLastMonth.length,
      todayBookings: bookingsToday,
      yesterdayBookings: bookingsYesterday,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEarningsStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Get all bookings this month
    const bookingsThisMonth = await Booking.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalEarnings = bookingsThisMonth.reduce((sum, booking) => {
      return sum + (booking.amount || 0); // or booking.amountPaid
    }, 0);

    const bookingCount = bookingsThisMonth.length;
    const averagePerBooking = bookingCount > 0 ? totalEarnings / bookingCount : 0;

    // Calculate projected monthly earnings
    const today = new Date();
    const currentDay = today.getDate();
    const totalDaysInMonth = endOfMonth.getDate();

    const projectedMonthlyEarnings =
      currentDay > 0 ? (totalEarnings / currentDay) * totalDaysInMonth : 0;

    res.status(200).json({
      totalEarnings: totalEarnings.toFixed(2),
      averagePerBooking: averagePerBooking.toFixed(2),
      projectedMonthlyEarnings: projectedMonthlyEarnings.toFixed(2),
      bookingCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const monthStats = async (req, res) => {
    const { boatOwnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(boatOwnerId)) {
        return res.status(400).json({ error: 'Invalid Boat Owner ID' });
    }

    try {
        const earnings = await Booking.aggregate([
            {
                $match: {
                    boatOwner: new mongoose.Types.ObjectId(boatOwnerId)
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$preferredDate" },
                        month: { $month: "$preferredDate" }
                    },
                    totalAmount: { $sum: "$amount" },
                    bookings: { $push: "$$ROOT" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        res.json(earnings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}


const getBookingsByBoatOwner = async (req, res) => {
  const { boatOwnerId } = req.params;

  try {
    const bookings = await Booking.aggregate([
      {
        $match: {
          boatOwner: new mongoose.Types.ObjectId(boatOwnerId)
        }
      },
      {
        $project: {
          numberOfPassengers: 1,
          firstName: 1,
          email: 1,
          amount: 1,
          preferredDate: 1,
          status: {
            $cond: {
              if: { $gte: ['$preferredDate', new Date()] },
              then: 'pending',
              else: 'confirmed',
            }
          }
        }
      },
      {
        $group: {
          _id: '$status',
          bookings: { $push: '$$ROOT' }
        }
      }
    ]);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Internal Server Error');
  }
};



const UpdateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const updatedOwner = await BoatOwner.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );

    if (!updatedOwner) {
      return res.status(404).json({ message: 'Boat owner not found' });
    }

    res.status(200).json(updatedOwner);
  } catch (error) {
    console.error('❌ Error updating availability:', error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
};

// 📄 Get Availability
const GetAvailability = async (req, res) => {
  try {
    const owner = await BoatOwner.findById(req.params.id);

    if (!owner) {
      return res.status(404).json({ message: 'Boat owner not found' });
    }

    res.status(200).json(owner);
  } catch (error) {
    console.error('❌ Error fetching availability:', error);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
};

module.exports = {
  PostBoatOwner,
  GetBoatOwner,
  DeleteBoatOwner,
  UpdateBoatOwner,
  UpdateAvailability,
  authLogin,
  getBookingStats,
  getEarningsStats,
  monthStats,
  getBookingsByBoatOwner,
  getAll,
  GetAvailability
}