const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ['Twitter', 'LinkedIn', 'Facebook'], // Example platforms
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 280, // Example character limit (like Twitter)
  },
  mediaUrl: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'published', 'failed'],
    default: 'scheduled',
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  publishedAt: {
    type: Date,
  },
  errorMessage: {
    type: String,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
