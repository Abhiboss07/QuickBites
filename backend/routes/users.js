import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'name image cuisine rating deliveryTime');

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/addresses
// @desc    Add new address
// @access  Private
router.put('/addresses', protect, async (req, res) => {
  try {
    const { type, street, city, state, zipCode, isDefault } = req.body;

    const newAddress = {
      type,
      street,
      city,
      state,
      zipCode,
      isDefault: isDefault || false
    };

    const user = await User.findById(req.user._id);

    // If this is the default address, unset other default addresses
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Address added successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding address'
    });
  }
});

// @route   PUT /api/users/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { type, street, city, state, zipCode, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    // If this is the default address, unset other default addresses
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Update address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      type,
      street,
      city,
      state,
      zipCode,
      isDefault: isDefault || false
    };

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating address'
    });
  }
});

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== addressId
    );

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting address'
    });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite restaurants
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        select: 'name image cuisine rating ratingCount deliveryTime deliveryFee priceRange category'
      });

    res.status(200).json({
      status: 'success',
      data: { favorites: user.favorites }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching favorites'
    });
  }
});

export default router;
