const axios = require('axios');
const { createBooking, applyPromoCode } = require('../services/bookingService');
const stripe = require("stripe")(process.env.STRIPE_SECURET_KEY)
module.exports = async (req, res) => {
  try {
    const { promocode, amount, email, firstName, lastName, phone, numberOfPassengers } = req.body;
    const numberOfPassengersInt = parseInt(numberOfPassengers, 10);
    const amountInt = parseInt(amount, 10);

    // Apply promo code logic
    const finalAmount = await applyPromoCode(promocode, amountInt, numberOfPassengersInt);

    // Create booking logic
    const savedBooking = await createBooking(req, promocode, finalAmount, numberOfPassengersInt);

    // Prepare payment request body for Chapa
    const session = await stripe.checkout.sessions.create({
        line_items:[
          {
            price_data:{
              currency:'usd',
              product_data:{
                name:"tankwa transportaion"
              },
              unit_amount:finalAmount
            },
            quantity: numberOfPassengers,
          }
        ],
        mode:'payment',
        success_url:`https://tankwa.vercel.app/congratulation/${savedBooking._id}`,
        cancel_url:process.env.BASE_URL
       })
    
       res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Error handling Chapa payment:', error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};
