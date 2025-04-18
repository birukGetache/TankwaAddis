const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("we are now")
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log("userr is not valid")
      return res.status(400).json({ message: 'Invalid credentials' });
    }
     console.log(user)
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("not macht")
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
    
    console.log(username , password)
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      console.log("user name exist")
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({ username, password });
    await user.save();
   console.log(user.username)
    
    res.status(201).json({ user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

module.exports = {
  PostUser,
  LoginUser
}