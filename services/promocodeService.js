const Promocode = require('../models/promoCode');

const checkPromocode = async (promocode) => {
  try {
    const validPromo = await Promocode.findOne({ code: promocode });

    if (!validPromo) {
      return { valid: false, message: 'Promo code not found' };
    }

    // Optional: Check for expiration
    if (validPromo.expiryDate && new Date() > validPromo.expiryDate) {
      return { valid: false, message: 'Promo code has expired' };
    }

    return {
      valid: true,
      discount: validPromo.discount, // You can return % or amount
      code: validPromo.code
    };
  } catch (error) {
    console.error('Error checking promo code:', error);
    return { valid: false, message: 'Server error' };
  }
};

module.exports = { checkPromocode };
