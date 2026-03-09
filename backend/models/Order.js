import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0
  },
  promoDiscount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    instructions: String
  },
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  actualDeliveryTime: {
    type: Date,
    default: null
  },
  trackingInfo: {
    driverName: String,
    driverPhone: String,
    driverLocation: {
      lat: Number,
      lng: Number
    },
    lastUpdate: {
      type: Date,
      default: Date.now
    }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `#${5000 + count + 1}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
