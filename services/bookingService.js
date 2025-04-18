const Promocode = require('../models/promoCode');
const BoatOwner = require('../models/BoatOwner');
const Booking = require('../models/bookingSchema');

module.exports.createBooking = async (req, promocode, amount, numberOfPassengersInt) => {
  const boatOwners = await BoatOwner.find();
  const minRound = Math.min(...boatOwners.map(owner => owner.round));
  const candidates = boatOwners.filter(owner => owner.round === minRound);
  const selectedBoatOwner = candidates[Math.floor(Math.random() * candidates.length)];

  if (selectedBoatOwner.size > 60) {
    selectedBoatOwner.round += 1;
  } else {
    selectedBoatOwner.size += numberOfPassengersInt;
  }

  await selectedBoatOwner.save();

  const newBooking = new Booking({ ...req.body, amount, boatOwner: selectedBoatOwner._id });
  const savedBooking = await newBooking.save();

  return savedBooking;
};

module.exports.applyPromoCode = async (promocode, amountInt, numberOfPassengersInt) => {
  let finalAmount = amountInt;
  
  if (promocode) {
    const validPromocode = await Promocode.findOne({ code: promocode });
    if (validPromocode) {
      if (numberOfPassengersInt > 5) {
        finalAmount = (amountInt * numberOfPassengersInt) - 30;
        await Promocode.deleteOne({ code: promocode });
      } else {
        finalAmount = (amountInt * numberOfPassengersInt) - 10;
      }
    } else {
      finalAmount = amountInt * numberOfPassengersInt;
    }
  } else {
    finalAmount = amountInt * numberOfPassengersInt;
  }

  return finalAmount;
};
