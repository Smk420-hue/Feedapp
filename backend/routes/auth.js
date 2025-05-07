const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Utility to create a JWT token
const generateToken = (userId) => {
  console.log("🔑 Generating token for user ID:", userId);
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  console.log("📥 Incoming register request:", req.body);
  const { username, password, email, phone, role } = req.body;

  try {
    console.log(`🔍 Checking if username already exists: ${username}`);
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log(`❌ Username already exists: ${username}`);
      return res.status(400).json({ message: 'Username already exists' });
    }

    console.log(`🔍 Checking if email already exists: ${email}`);
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      console.log(`❌ Email already exists: ${email}`);
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.log("🛠️ Creating new user...");
    // ⛔ REMOVE manual bcrypt.hash(password)
    const user = await User.create({ username, password, email, phone, role });

    console.log("✅ User created successfully:", user.username);
    res.status(201).json({ message: 'User registered successfully' });
    
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});



// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await User.scope('withPassword').findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const isValid = await user.validPassword(password);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = generateToken(user.id);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  });
});


// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
  console.log("📥 Incoming auth check request");

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("⚠️ No token provided");
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔍 Verifying token...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Token verified, user ID:", decoded.id);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role'],
    });

    if (!user) {
      console.warn("⚠️ User not found by ID:", decoded.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("✅ Auth check successful for user:", user.username);

    res.json(user);
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
