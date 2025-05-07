const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token missing');
    }
    const token = authHeader.replace('Bearer ', '');

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user in database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // Don't send password back
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 4. Attach user to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ 
      error: 'Please authenticate. Token invalid or expired.' 
    });
  }
};