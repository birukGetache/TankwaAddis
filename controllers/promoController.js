const { checkPromocode } = require('../services/promocodeService');

const checkPromoCodeController = async (req, res) => {
  const { promoCode } = req.body;

  if (!promoCode) {
    return res.status(400).json({ valid: false, message: 'Promo code is required' });
  }

  const result = await checkPromocode(promoCode);

  if (!result.valid) {
    return res.status(404).json(result);
  }

  res.status(200).json(result);
};

module.exports = { checkPromoCodeController };
