import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    // Clear existing data
    await Restaurant.deleteMany({});
    await User.deleteMany({});

    // Create categories array
    const categories = [
      { id: 'pizza', label: 'Pizza', emoji: '🍕', color: '#fff7ed' },
      { id: 'burger', label: 'Burger', emoji: '🍔', color: '#fef2f2' },
      { id: 'taco', label: 'Taco', emoji: '🌮', color: '#fefce8' },
      { id: 'healthy', label: 'Healthy', emoji: '🥗', color: '#f0fdf4' },
      { id: 'donut', label: 'Donut', emoji: '🍩', color: '#fdf2f8' },
      { id: 'sushi', label: 'Sushi', emoji: '🍣', color: '#faf5ff' },
      { id: 'noodles', label: 'Noodles', emoji: '🍜', color: '#fffbeb' },
      { id: 'ice-cream', label: 'Ice Cream', emoji: '🍦', color: '#f0f9ff' },
    ];

    // Restaurant data
    const restaurantsData = [
      {
        name: 'Pizza Palace',
        cuisine: 'Italian • Pizza • Comfort Food',
        rating: 4.8,
        ratingCount: 1200,
        deliveryTime: '30-45 min',
        deliveryFee: 0,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
        category: 'pizza',
        ecoFriendly: true,
        featured: true,
        menuCategories: ['Popular', 'Pizza', 'Sides', 'Drinks', 'Desserts'],
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        phone: '+1-234-567-8900',
        email: 'info@pizzapalace.com',
        menu: [
          {
            name: 'Margherita Supreme',
            description: 'Fresh mozzarella, basil, San Marzano tomato sauce on hand-tossed dough.',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
            category: 'Popular',
            spicy: false,
            vegetarian: true,
            preparationTime: 20
          },
          {
            name: 'Pepperoni Feast',
            description: 'Double pepperoni, melted cheese blend, oregano on crispy thin crust.',
            price: 16.99,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
            category: 'Pizza',
            spicy: false,
            vegetarian: false,
            preparationTime: 25
          },
          {
            name: 'Garlic Bread Sticks',
            description: 'Warm garlic butter breadsticks with marinara dipping sauce.',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
            category: 'Sides',
            spicy: false,
            vegetarian: true,
            preparationTime: 10
          },
          {
            name: 'Spicy BBQ Chicken Pizza',
            description: 'BBQ chicken, jalapeños, red onion, smoky chipotle drizzle.',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
            category: 'Popular',
            spicy: true,
            vegetarian: false,
            preparationTime: 30
          }
        ]
      },
      {
        name: 'Burger Buddy',
        cuisine: 'American • Burgers • Fast Food',
        rating: 4.5,
        ratingCount: 890,
        deliveryTime: '15-25 min',
        deliveryFee: 2.99,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9457c59f0?w=400&h=300&fit=crop',
        category: 'burger',
        ecoFriendly: false,
        featured: true,
        menuCategories: ['Popular', 'Burgers', 'Sides', 'Drinks', 'Shakes'],
        address: {
          street: '456 Oak Ave',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201',
          coordinates: { lat: 40.6782, lng: -73.9442 }
        },
        phone: '+1-234-567-8901',
        email: 'hello@burgerbuddy.com',
        menu: [
          {
            name: 'Double Stack Deluxe',
            description: 'Two beef patties, cheddar, pickles, special sauce on a sesame bun.',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9457c59f0?w=200&h=200&fit=crop',
            category: 'Popular',
            spicy: false,
            vegetarian: false,
            preparationTime: 15
          },
          {
            name: 'Spicy Crispy Chicken',
            description: 'Fried chicken breast, jalapenos, spicy mayo, lettuce.',
            price: 10.50,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9457c59f0?w=200&h=200&fit=crop',
            category: 'Popular',
            spicy: true,
            vegetarian: false,
            preparationTime: 18
          },
          {
            name: 'Golden Fries',
            description: 'Crispy salted fries, served with our house ketchup.',
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9457c59f0?w=200&h=200&fit=crop',
            category: 'Sides',
            spicy: false,
            vegetarian: true,
            preparationTime: 8
          },
          {
            name: 'Mega Shake',
            description: 'Thick chocolate milkshake topped with whipped cream.',
            price: 6.50,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9457c59f0?w=200&h=200&fit=crop',
            category: 'Shakes',
            spicy: false,
            vegetarian: true,
            preparationTime: 5
          }
        ]
      },
      {
        name: 'Sushi Sam',
        cuisine: 'Japanese • Sushi • Healthy',
        rating: 4.9,
        ratingCount: 2100,
        deliveryTime: '40-55 min',
        deliveryFee: 0,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        category: 'sushi',
        ecoFriendly: true,
        featured: true,
        menuCategories: ['Popular', 'Rolls', 'Sashimi', 'Sides', 'Drinks'],
        address: {
          street: '789 Pine St',
          city: 'Manhattan',
          state: 'NY',
          zipCode: '10002',
          coordinates: { lat: 40.7181, lng: -73.9974 }
        },
        phone: '+1-234-567-8902',
        email: 'contact@sushisam.com',
        menu: [
          {
            name: 'Rainbow Dragon Roll',
            description: 'Avocado, crab, topped with assorted sashimi and tobiko.',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
            category: 'Popular',
            spicy: false,
            vegetarian: false,
            preparationTime: 25
          },
          {
            name: 'Spicy Tuna Crunch',
            description: 'Spicy tuna, cucumber, crispy tempura flakes, sriracha drizzle.',
            price: 15.99,
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
            category: 'Rolls',
            spicy: true,
            vegetarian: false,
            preparationTime: 20
          },
          {
            name: 'Salmon Sashimi',
            description: 'Premium fresh salmon, 8 pieces, served with wasabi and ginger.',
            price: 16.99,
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
            category: 'Sashimi',
            spicy: false,
            vegetarian: false,
            preparationTime: 15
          },
          {
            name: 'Edamame Bowl',
            description: 'Steamed edamame with sea salt and a squeeze of lemon.',
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
            category: 'Sides',
            spicy: false,
            vegetarian: true,
            preparationTime: 8
          }
        ]
      },
      {
        name: 'Taco Town',
        cuisine: 'Mexican • Tacos • Burritos',
        rating: 4.6,
        ratingCount: 650,
        deliveryTime: '20-30 min',
        deliveryFee: 1.99,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
        category: 'taco',
        ecoFriendly: false,
        featured: false,
        menuCategories: ['Popular', 'Tacos', 'Burritos', 'Sides', 'Drinks'],
        address: {
          street: '321 Elm St',
          city: 'Queens',
          state: 'NY',
          zipCode: '11375',
          coordinates: { lat: 40.7282, lng: -73.7949 }
        },
        phone: '+1-234-567-8903',
        email: 'info@tacotown.com',
        menu: [
          {
            name: 'Street Tacos Trio',
            description: 'Three corn tortilla tacos with seasoned beef, cilantro, onion.',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
            category: 'Popular',
            spicy: false,
            vegetarian: false,
            preparationTime: 12
          },
          {
            name: 'Loaded Burrito',
            description: 'Flour tortilla packed with rice, beans, cheese, sour cream, guac.',
            price: 11.99,
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
            category: 'Burritos',
            spicy: false,
            vegetarian: true,
            preparationTime: 15
          },
          {
            name: 'Fiery Ghost Pepper Taco',
            description: 'Ghost pepper salsa, grilled chicken, mango slaw. Dare to try!',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
            category: 'Tacos',
            spicy: true,
            vegetarian: false,
            preparationTime: 10
          },
          {
            name: 'Churros & Chocolate',
            description: 'Golden cinnamon churros with rich chocolate dipping sauce.',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
            category: 'Sides',
            spicy: false,
            vegetarian: true,
            preparationTime: 8
          }
        ]
      },
      {
        name: 'Green Bowl',
        cuisine: 'Healthy • Salads • Bowls',
        rating: 4.7,
        ratingCount: 430,
        deliveryTime: '25-35 min',
        deliveryFee: 0,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        category: 'healthy',
        ecoFriendly: true,
        featured: false,
        menuCategories: ['Popular', 'Bowls', 'Salads', 'Smoothies'],
        address: {
          street: '654 Maple Dr',
          city: 'Bronx',
          state: 'NY',
          zipCode: '10451',
          coordinates: { lat: 40.8448, lng: -73.8648 }
        },
        phone: '+1-234-567-8904',
        email: 'hello@greenbowl.com',
        menu: [
          {
            name: 'Acai Power Bowl',
            description: 'Acai blend topped with granola, banana, berries, honey drizzle.',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
            category: 'Popular',
            spicy: false,
            vegetarian: true,
            preparationTime: 10
          },
          {
            name: 'Mediterranean Quinoa',
            description: 'Quinoa, chickpeas, cucumber, feta, cherry tomatoes, lemon dressing.',
            price: 13.99,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
            category: 'Bowls',
            spicy: false,
            vegetarian: true,
            preparationTime: 12
          }
        ]
      }
    ];

    // Insert restaurants
    const insertedRestaurants = await Restaurant.insertMany(restaurantsData);
    console.log(`✅ ${insertedRestaurants.length} restaurants seeded successfully`);

    // Create a demo user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const demoUser = await User.create({
      name: 'Foodie Friend',
      email: 'foodie@quickbites.com',
      password: hashedPassword,
      phone: '+1-234-567-8900',
      addresses: [
        {
          type: 'home',
          street: '123 Demo Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          isDefault: true
        }
      ],
      favorites: [insertedRestaurants[0]._id] // Add first restaurant as favorite
    });

    console.log(`✅ Demo user created: ${demoUser.email} (password: password123)`);
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
if (process.argv[2] === 'seed') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickbites')
    .then(() => {
      console.log('🔄 Connected to MongoDB, starting seed...');
      seedData();
    })
    .catch(error => {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    });
}

export default seedData;
