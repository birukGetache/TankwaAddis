require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Booking = require("./router/Booking.js")
const Blog = require("./models/Blog"); 
const stripe = require("stripe")(process.env.STRIPE_SECURET_KEY)
const User = require("./router/authRoutes.js"); 
const multer = require("multer");
const payment = require('./router/PostTransaction')
const paypalReturn = require('./router/PaypalReturn.js')
const checkPromocode = require('./router/promoRoutes.js')
const BoatOwner = require('./router/BoatOwners.js')
const Blogs = require('./router/Blogs.js')
const destinationRouter = require('./router/Destination'); 
const Sponser = require('./router/Sponser.js')
const path = require("path");


const app = express();
const cloudinary = require('cloudinary').v2;
const router = express.Router();
// Enable CORS
const corsOptions = {
   origin: ['https://tankwa.vercel.app','http://localhost:3001','http://localhost:3000'], // Allow requests from both Vercel and localhost
  methods: ['GET', 'POST', 'PUT', 'DELEappTE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(express.urlencoded({ extended: true })); // To handle form submissions
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


cloudinary.config({ 
  cloud_name: 'drpuygxkj', 
  api_key: '862122525455791', 
  api_secret: '7c5LGGeCw9tSMEkQK4oqu4bbd2A' // Click 'View API Keys' above to copy your API secret
});




app.use(cors(corsOptions));

// Middleware to parse JSON body
app.use(express.json());

// Connect to MongoDB

const uri = "mongodb+srv://burab1742:123@cluster0.wquid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

  app.use("/PostTransaction", payment);

app.use('/paypal/return', paypalReturn);

app.use('/apiuser',User);

app.use('/booking', Booking);

//app.use('/bookings', Bookings);


app.use("/api/blogs", Blogs);

 app.use('/boatowners',BoatOwner);

// // Update boat owner by ID
// app.use('/boatowners/:id',UpdateBoatOwner);

// // Get all sponsors
 app.use('/sponser',Sponser);

// Add a new sponsor with image upload

// app.use('/sponser',  UploadPost);
// app.use('/sponser/:id',  Sponser);

// // Delete a sponsor
// app.use('/sponser/:id',DeleteSponser);


//  app.use('/upload',UploadPostReal);


// app.use('/destinations', GetDestinations);


// // Get all l.destinations
app.use('/destinations', destinationRouter);

// // Update a destination
// app.use('/destinations/:id',UpdateDestination);

// // Delete a destination
// app.delete('/destinations/:id', DeleteDestination);

app.use('/checkPromo' , checkPromocode)

// Use the router
app.use("/", router);

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
