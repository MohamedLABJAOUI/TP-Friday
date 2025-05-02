const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Add test user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const testUser = new User({
      email: 'admin@example.com',
      password: hashedPassword
    });
    await testUser.save();
    console.log('Test user created successfully');

    // Add sample products
    const products = [
      {
        name: 'Laptop Pro',
        price: 1299.99,
        description: 'High-performance laptop for professionals'
      },
      {
        name: 'Smartphone X',
        price: 799.99,
        description: 'Latest smartphone with advanced features'
      },
      {
        name: 'Wireless Headphones',
        price: 199.99,
        description: 'Premium wireless headphones with noise cancellation'
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDb(); 