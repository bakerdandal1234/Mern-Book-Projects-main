const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const { protect } = require('../middleware'); // Assuming you have a protect middleware

router.route('/').post(protect, createPost).get(protect, getPosts);

module.exports = router;
