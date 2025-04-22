const paypal = require('./paypal'); // Your PayPal SDK configuration
const TempBooking = require('../models/TempBooking');
const Promocode = require('../models/promoCode');

async function handlePaypalPayment(req, res) {
    try {
        const { promocode, amount, email, firstName, lastName, phone, numberOfPassengers, preferredDate, currency, paymentMethod, typeOfTransport, destinationLocation, departureLocation } = req.body;

        const numberOfPassengersInt = parseInt(numberOfPassengers, 10);
        const amountInt = parseInt(amount, 10);

        let finalAmount = amountInt * numberOfPassengersInt;
        if (promocode) {
            const validPromocode = await Promocode.findOne({ code: promocode });
            if (validPromocode) {
                finalAmount -= (numberOfPassengersInt > 5) ? 30 : 10;
                await Promocode.deleteOne({ code: promocode });
            }
        }

        (finalAmount);
        const tempBooking = new TempBooking({
            promocode,
            amount: finalAmount,
            email,
            firstName,
            lastName,
            phone,
            currency,
            preferredDate,
            paymentMethod,
            typeOfTransport,
            destinationLocation,
            departureLocation,
            numberOfPassengers: numberOfPassengersInt,
        });

        const savedTempBooking = await tempBooking.save();
        const urlpaypal = await paypal.createOrder(finalAmount, savedTempBooking._id);

        if (!urlpaypal) throw new Error('Failed to create PayPal order');
        return res.json({ url: urlpaypal });

    } catch (error) {
        ("Error handling PayPal payment:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { handlePaypalPayment };
