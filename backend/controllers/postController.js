const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { platform, content, scheduledAt } = req.body;

    const post = new Post({
      user: req.user.id,
      platform,
      content,
      scheduledAt,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all posts for a user
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ scheduledAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createPost, getPosts };
