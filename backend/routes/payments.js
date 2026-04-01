import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Razorpay - uses test keys if not configured
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// @route   POST /api/payments/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid amount is required',
      });
    }

    // Amount in paise (Razorpay expects smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `order_rcpt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      },
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);

    // If Razorpay keys aren't configured, allow COD fallback
    if (error.statusCode === 401 || error.error?.code === 'BAD_REQUEST_ERROR') {
      return res.status(200).json({
        status: 'success',
        data: {
          orderId: `cod_${Date.now()}`,
          amount: Math.round(req.body.amount * 100),
          currency: req.body.currency || 'INR',
          keyId: null,
          codFallback: true,
        },
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create payment order',
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // For COD orders, skip verification
    if (razorpay_order_id?.startsWith('cod_')) {
      return res.status(200).json({
        status: 'success',
        data: {
          verified: true,
          paymentMethod: 'cod',
          paymentId: `cod_pay_${Date.now()}`,
        },
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing payment verification data',
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      res.status(200).json({
        status: 'success',
        data: {
          verified: true,
          paymentMethod: 'razorpay',
          paymentId: razorpay_payment_id,
        },
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Payment verification failed',
    });
  }
});

export default router;
