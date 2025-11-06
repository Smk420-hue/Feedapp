const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middleware/auth'); 

// ✅ Create a new post (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user; // Now available because of middleware

    const post = await Post.create({
      content,
      userId: user.id,
      createdByUsername: user.username,
      isApproved: user.role === 'admin', // auto-approve for admin
    });

    res.status(201).json({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      isApproved: post.isApproved,
      createdByUsername: post.createdByUsername,
    });
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get all approved posts and user’s own posts (protected)
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user;

    const posts = await Post.findAll({
      where: {
        [Op.or]: [{ isApproved: true }, { userId: user.id }],
      },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username'] }],
    });

    res.json(
      posts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        isApproved: post.isApproved,
        createdByUsername: post.User.username,
        isOwnPost: post.userId === user.id,
      }))
    );
  } catch (error) {
    console.error('❌ Error fetching posts:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update post (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    const post = await Post.findOne({ where: { id, userId: user.id } });

    if (!post) return res.status(404).json({ error: 'Post not found or not authorized' });

    post.content = content;
    post.isApproved = user.role === 'admin';
    await post.save();

    res.json({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      isApproved: post.isApproved,
      createdByUsername: post.createdByUsername,
    });
  } catch (error) {
    console.error('❌ Error updating post:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete post (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const post = await Post.findOne({ where: { id, userId: user.id } });

    if (!post) return res.status(404).json({ error: 'Post not found or not authorized' });

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting post:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
