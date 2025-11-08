const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

// Middleware to check if user is admin
const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};


// Get all pending posts for approval
router.get('/pending-posts', adminCheck, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { isApproved: false },
      order: [['createdAt', 'ASC']],
      include: [{
        model: User,
        attributes: ['username', 'email']
      }]
    });

    // Debug log (safe for production)
    console.log(`📊 Found ${posts.length} pending posts`);

    const formattedPosts = posts.map(post => {
      if (!post.User) {
        console.warn(`⚠️ Post ${post.id} has no associated User (userId=${post.userId})`);
      }

      return {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        createdByUsername: post.User ? post.User.username : 'Unknown',
        createdByEmail: post.User ? post.User.email : 'N/A'
      };
    });

    res.json(formattedPosts);
  } catch (error) {
    console.error('❌ Error in /pending-posts:', error);
    res.status(500).json({ error: error.message });
  }
});


// Approve a post
router.put('/approve-post/:id', adminCheck, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isApproved = true;
    await post.save();

    res.json({
      id: post.id,
      content: post.content,
      isApproved: post.isApproved,
      message: 'Post approved successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a post (admin can delete any post)
router.delete('/delete-post/:id', adminCheck, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully by admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/users', adminCheck, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role (admin only)
router.put('/update-user-role/:id', adminCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      message: 'User role updated successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
