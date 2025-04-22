const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    ("we are now")
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      ("userr is not valid")
      return res.status(400).json({ message: 'Invalid credentials' });
    }
     (user)
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      ("not macht")
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

const PostUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      ("user name exist")
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    ("these line pass the user already exists")
    user = new User({ username, password });
  
    await user.save();
    
   (user)
    
    res.status(201).json({ user: { username: user.username } });
  } catch (err) {
    (err)
    res.status(500).json({ message: err });
  }
}

const LoginBoatOwner = async (req, res) => {
  try {
    const { name, password } = req.body;
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      ("user name exist")
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    ("these line pass the user already exists")
    user = new User({ username, password });
  
    await user.save();
    
   (user)
    
    res.status(201).json({ user: { username: user.username } });
  } catch (err) {
    (err)
    res.status(500).json({ message: err });
  }
}

module.exports = {
  PostUser,
  LoginUser,
  LoginBoatOwner
}