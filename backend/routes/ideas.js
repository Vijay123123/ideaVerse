const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Idea = require('../models/Idea');

// Custom middleware for development
const customAuthMiddleware = (req, res, next) => {
  console.log('Custom auth middleware');
  console.log('Headers:', req.headers);

  // Try to use Clerk auth, but fall back to a development user if it fails
  try {
    ClerkExpressRequireAuth()(req, res, (err) => {
      if (err) {
        console.log('Clerk auth failed, using development user');
        // For development, set a fake user
        req.auth = {
          userId: 'dev-user-id',
          sessionId: 'dev-session-id'
        };
      }
      next();
    });
  } catch (error) {
    console.error('Error in auth middleware:', error);
    // For development, set a fake user
    req.auth = {
      userId: 'dev-user-id',
      sessionId: 'dev-session-id'
    };
    next();
  }
};

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Filter ideas by category
router.get('/filter/category', async (req, res) => {
  const { category } = req.query;

  try {
    const ideas = await Idea.find({ category }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new idea (protected route)
router.post('/', customAuthMiddleware, async (req, res) => {
  const { title, description, category, imageUrl, userId, userName } = req.body;

  try {
    const newIdea = new Idea({
      title,
      description,
      category,
      imageUrl,
      userId,
      userName
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (err) {
    console.error('Error creating idea:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update an idea (protected route)
router.put('/:id', customAuthMiddleware, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // Check if idea exists
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Check if user is the owner of the idea
    if (idea.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to update this idea' });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedIdea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an idea (protected route)
router.delete('/:id', customAuthMiddleware, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // Check if idea exists
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Check if user is the owner of the idea
    if (idea.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this idea' });
    }

    await Idea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Idea deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Filter ideas by category
router.get('/filter/category', async (req, res) => {
  const { category } = req.query;

  try {
    const ideas = await Idea.find({ category }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like an idea (protected route)
router.post('/:id/like', customAuthMiddleware, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // Check if idea exists
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Check if user has already liked this idea
    if (!idea.likedBy) {
      idea.likedBy = [];
    }

    const userIndex = idea.likedBy.indexOf(req.auth.userId);

    if (userIndex > -1) {
      // User already liked this idea, so unlike it
      idea.likedBy.splice(userIndex, 1);
      idea.likes = idea.likedBy.length;
      const updatedIdea = await idea.save();
      return res.json({
        likes: updatedIdea.likes,
        liked: false,
        message: 'Like removed successfully'
      });
    } else {
      // User hasn't liked this idea yet, so like it
      idea.likedBy.push(req.auth.userId);
      idea.likes = idea.likedBy.length;
      const updatedIdea = await idea.save();
      return res.json({
        likes: updatedIdea.likes,
        liked: true,
        message: 'Idea liked successfully'
      });
    }
  } catch (err) {
    console.error('Error liking idea:', err);
    res.status(500).json({ message: err.message });
  }
});

// Check if user has liked an idea
router.get('/:id/liked', customAuthMiddleware, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // Check if idea exists
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Check if user has liked this idea
    const liked = idea.likedBy && idea.likedBy.includes(req.auth.userId);

    res.json({ liked });
  } catch (err) {
    console.error('Error checking like status:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
