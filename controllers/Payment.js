const chapaPayment = require('../helper/chapa')
const StripePayment = require('../helper/stripe')
const {handlePaypalPayment} = require('../helper/paypalpayment')
module.exports.payment = async (req, res) => {
        console.log(req.body);
        if(req.body.paymentMethod === 'Chapa'){
          console.log
        try {
          return await chapaPayment(req, res);
        } catch (error) {
          console.log("Error handling payment:", error);
          res.status(500).json({ error: error.message });
        }} 
        else if(req.body.paymentMethod === 'stripe'){
        try {
          return await StripePayment(req, res);
        } catch (error) {
          console.log("Error handling payment:", error);
          res.status(500).json({ error: error.message });
        }} 
        else if(req.body.paymentMethod === 'paypal'){
          try {
            //paypal for sell 
            return await handlePaypalPayment(req, res);
          } catch (error) {
            console.log("Error handling payment:", error);
            res.status(500).json({ error: error.message });
          }
        }
};