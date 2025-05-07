const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
const { Op } = require('sequelize');

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;

    const post = await Post.create({
      content,
      userId: user.id,
      createdByUsername: user.username,
      isApproved: user.role === 'admin' // Auto-approve if admin
    });

    res.status(201).json({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      isApproved: post.isApproved,
      createdByUsername: post.createdByUsername
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all approved posts and user's own posts
router.get('/', async (req, res) => {
  try {
    const user = req.user;

    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { isApproved: true },
          { userId: user.id }
        ]
      },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['username']
      }]
    });

    res.json(posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      isApproved: post.isApproved,
      createdByUsername: post.User.username,
      isOwnPost: post.userId === user.id
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post (only owner can update)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    const post = await Post.findOne({ where: { id, userId: user.id } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or not authorized' });
    }

    post.content = content;
    post.isApproved = user.role === 'admin'; // Auto-approve if admin
    await post.save();

    res.json({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      isApproved: post.isApproved,
      createdByUsername: post.createdByUsername
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a post (only owner can delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const post = await Post.findOne({ where: { id, userId: user.id } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or not authorized' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;