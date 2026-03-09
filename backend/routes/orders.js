import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('restaurant', 'name image cuisine deliveryTime')
      .populate('user', 'name email');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    })
    .populate('restaurant', 'name image cuisine deliveryTime phone address')
    .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, [
  body('restaurant').isMongoId().withMessage('Valid restaurant ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItem').isMongoId().withMessage('Valid menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Zip code is required')
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

    const {
      restaurant,
      items,
      deliveryAddress,
      deliveryFee = 0,
      promoDiscount = 0,
      notes = ''
    } = req.body;

    // Calculate totals
    const subtotal = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const totalAmount = subtotal + deliveryFee - (subtotal * promoDiscount);

    // Calculate estimated delivery time (30-45 minutes from now)
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 35);

    // Get restaurant name
    const restaurantDoc = await mongoose.model('Restaurant').findById(restaurant);
    const restaurantName = restaurantDoc ? restaurantDoc.name : 'Unknown Restaurant';

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `#${5000 + orderCount + 1}`;

    // Create order
    const order = new Order({
      orderNumber,
      user: req.user._id,
      restaurant,
      restaurantName,
      items,
      subtotal,
      deliveryFee,
      promoDiscount,
      totalAmount,
      deliveryAddress,
      estimatedDeliveryTime,
      notes,
      status: 'pending'
    });

    await order.save();

    // Populate restaurant details for response
    await order.populate('restaurant', 'name image cuisine deliveryTime');

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating order'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['out-for-delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while cancelling order'
    });
  }
});

// @route   GET /api/orders/track/:orderNumber
// @desc    Track order by order number
// @access  Public (but requires user authentication for sensitive data)
router.get('/track/:orderNumber', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderNumber,
      user: req.user._id 
    })
    .populate('restaurant', 'name image cuisine deliveryTime')
    .select('orderNumber status items restaurantName estimatedDeliveryTime trackingInfo createdAt');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Calculate order progress
    const statusProgress = {
      'pending': 10,
      'confirmed': 25,
      'preparing': 50,
      'ready': 75,
      'out-for-delivery': 90,
      'delivered': 100,
      'cancelled': 0
    };

    const trackingData = {
      orderNumber: order.orderNumber,
      status: order.status,
      progress: statusProgress[order.status] || 0,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      trackingInfo: order.trackingInfo,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity
      })),
      restaurantName: order.restaurantName,
      createdAt: order.createdAt
    };

    res.status(200).json({
      status: 'success',
      data: { tracking: trackingData }
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while tracking order'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (for delivery tracking simulation)
// @access  Private
router.put('/:id/status', protect, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered']).withMessage('Invalid status')
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

    const { status } = req.body;
    
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Update tracking info based on status
    if (status === 'out-for-delivery') {
      order.trackingInfo = {
        driverName: 'John Delivery',
        driverPhone: '+1234567890',
        driverLocation: { lat: 40.7128, lng: -74.0060 },
        lastUpdate: new Date()
      };
    }

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating order status'
    });
  }
});

export default router;
