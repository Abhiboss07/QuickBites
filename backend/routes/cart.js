import express from 'express';
import Cart from '../models/Cart.js';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.restaurant');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      status: 'success',
      data: { cart }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, [
  body('menuItem').isMongoId().withMessage('Valid menu item ID is required'),
  body('restaurant').isMongoId().withMessage('Valid restaurant ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { menuItem, restaurant, quantity, price } = req.body;

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItem
    );

    if (existingItemIndex !== -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItem,
        restaurant,
        quantity,
        price
      });
    }

    await cart.save();
    await cart.populate('items.restaurant');

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding item to cart'
    });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', protect, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate('items.restaurant');

    res.status(200).json({
      status: 'success',
      message: 'Cart item updated successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating cart'
    });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();
    await cart.populate('items.restaurant');

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing item from cart'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], promoCode: '', promoDiscount: 0 },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while clearing cart'
    });
  }
});

// @route   POST /api/cart/apply-promo
// @desc    Apply promo code to cart
// @access  Private
router.post('/apply-promo', protect, [
  body('promoCode').trim().notEmpty().withMessage('Promo code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { promoCode } = req.body;

    // Define promo codes (in a real app, this would come from a database)
    const promoCodes = {
      'YUMMY20': { discount: 0.20, label: '20% Off', minOrder: 15 },
      'QUICK10': { discount: 0.10, label: '10% Off', minOrder: 10 },
      'FIRST50': { discount: 0.50, label: '50% Off (First Order!)', minOrder: 0, maxDiscount: 15 },
      'FREESHIP': { discount: 0, label: 'Free Delivery', freeDelivery: true, minOrder: 20 },
    };

    const promo = promoCodes[promoCode.toUpperCase()];

    if (!promo) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid promo code'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    // Check minimum order requirement
    if (promo.minOrder && cart.totalAmount < promo.minOrder) {
      return res.status(400).json({
        status: 'error',
        message: `Minimum order of $${promo.minOrder} required for this promo code`
      });
    }

    cart.promoCode = promoCode.toUpperCase();
    cart.promoDiscount = promo.discount;

    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Promo code applied successfully',
      data: {
        promoCode: cart.promoCode,
        promoDiscount: cart.promoDiscount,
        promoLabel: promo.label
      }
    });
  } catch (error) {
    console.error('Apply promo error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while applying promo code'
    });
  }
});

export default router;
