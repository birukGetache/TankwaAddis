const Session = require('../models/seesion');

const sessionController = async (req, res) => {
  const sessionData = req.body;

  try {
    const session = new Session(sessionData);
    await session.save();
    console.log('📦 Session saved to DB:', session);
    res.status(200).json({ message: 'Session received and stored.' });
  } catch (error) {
    console.error('❌ Failed to save session:', error);
    res.status(500).json({ message: 'Failed to store session.' });
  }
};

module.exports = sessionController;
