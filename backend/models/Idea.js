const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Business', 'Education', 'Health', 'Entertainment', 'Other']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Idea', IdeaSchema);
