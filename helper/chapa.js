const axios = require('axios');
const { createBooking, applyPromoCode } = require('../services/bookingService');
const Destination = require('../models/Destination');

module.exports = async (req, res) => {
  console.log("we are here biruk do not these is error")
  console.log(req.body)
  try {
    const { promocode, destinationID, email, firstName, lastName, phone, numberOfPassengers } = req.body;
    const numberOfPassengersInt = parseInt(numberOfPassengers, 10);
    const result = Destination.find({ _id: destinationID });
    console.log(result)
    const amount = result.price;
    console.log(amount)
    const amountInt = parseInt(amount, 10);
    console.log(typeof amountInt)
    // Apply promo code logic
    const finalAmount = await applyPromoCode(promocode, amountInt, numberOfPassengersInt);

    // Create booking logic
    const savedBooking = await createBooking(req, promocode, finalAmount, numberOfPassengersInt);

    // Prepare payment request body for Chapa
    const body = {
        amount: finalAmount, // Adjusted amount
        currency: "ETB",
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        tx_ref: "chewatatest-" + Date.now(),
        callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
        return_url: `https://tankwa.vercel.app/congratulation/${savedBooking._id}`,
        customization: {
          title: "Payment for ",
          description: "I love online payments",
        },
        meta: {
          hide_receipt: "true",
        },
      };
    const options = {
        method: "POST",
        url: "https://api.chapa.co/v1/transaction/initialize",
        headers: {
          Authorization: "Bearer CHASECK_TEST-E2XnZBkD5AqYSXud9MWRnqHtRqgqZYPm", // Replace with your Chapa test key
          "Content-Type": "application/json",
        },
        data: body,
      };

    const response = await axios(options);
    const chapaResponse = response.data;

    res.status(201).json({
      message: "Booking created successfully, redirect to payment",
      paymentUrl: chapaResponse.data.checkout_url,
      booking: savedBooking,
    });
  } catch (error) {
    console.error('Error handling Chapa payment:', error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};
