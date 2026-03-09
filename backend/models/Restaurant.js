import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  spicy: {
    type: Boolean,
    default: false
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: String,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  ecoFriendly: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  menuCategories: [{
    type: String,
    required: true
  }],
  menu: [menuItemSchema],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  phone: String,
  email: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
restaurantSchema.index({ name: 'text', cuisine: 'text', category: 'text' });

export default mongoose.model('Restaurant', restaurantSchema);
