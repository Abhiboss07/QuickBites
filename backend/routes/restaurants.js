import express from 'express';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      featured,
      ecoFriendly,
      page = 1,
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (ecoFriendly === 'true') {
      query.ecoFriendly = true;
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-menu'); // Exclude menu for list view

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        restaurants,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching restaurants'
    });
  }
});

// @route   GET /api/restaurants/categories
// @desc    Get restaurant categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Restaurant.distinct('category');
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Restaurant.countDocuments({ category, isActive: true });
        return { category, count };
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        categories: categoryCounts
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID with menu
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    if (!restaurant.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant is not available'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        restaurant
      }
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching restaurant'
    });
  }
});

// @route   POST /api/restaurants/:id/favorite
// @desc    Add/remove restaurant from favorites
// @access  Private
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.includes(req.params.id);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.id);
    } else {
      // Add to favorites
      user.favorites.push(req.params.id);
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      message: isFavorite ? 'Restaurant removed from favorites' : 'Restaurant added to favorites',
      data: {
        isFavorite: !isFavorite
      }
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating favorites'
    });
  }
});

// @route   GET /api/restaurants/featured
// @desc    Get featured restaurants
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ featured: true, isActive: true })
      .sort({ rating: -1 })
      .limit(10)
      .select('-menu');

    res.status(200).json({
      status: 'success',
      data: {
        restaurants
      }
    });
  } catch (error) {
    console.error('Get featured restaurants error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching featured restaurants'
    });
  }
});

export default router;
