#!/usr/bin/env node

/**
 * Debug script to check your Clerk + MongoDB setup
 * Run this with: node debug-setup.js
 */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Clerk + MongoDB Setup Debug Script\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('--------------------------------');

const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY', 
  'SIGNING_SECRET',
  'MONGODB_URI'
];

let allEnvVarsPresent = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isPresent = !!value;
  const status = isPresent ? '✅' : '❌';
  
  console.log(`${status} ${varName}: ${isPresent ? 'Present' : 'Missing'}`);
  
  if (isPresent && varName.includes('KEY') || varName.includes('SECRET')) {
    console.log(`   Value: ${value.substring(0, 10)}...${value.substring(value.length - 4)}`);
  } else if (isPresent && varName === 'MONGODB_URI') {
    console.log(`   Value: ${value.substring(0, 20)}...`);
  }
  
  if (!isPresent) {
    allEnvVarsPresent = false;
  }
});

console.log('\n🔗 Database Connection Test:');
console.log('----------------------------');

if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI not found. Cannot test database connection.');
} else {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connection successful');
      
      // Test basic operations
      const User = require('./src/models/User');
      return User.countDocuments();
    })
    .then(count => {
      console.log(`✅ Database operations working. User count: ${count}`);
      mongoose.connection.close();
    })
    .catch(error => {
      console.log('❌ Database connection failed:', error.message);
      mongoose.connection.close();
    });
}

console.log('\n📝 Next Steps:');
console.log('---------------');

if (!allEnvVarsPresent) {
  console.log('1. Create a .env.local file with all required environment variables');
  console.log('2. Get your Clerk keys from the Clerk Dashboard');
  console.log('3. Set up your MongoDB Atlas cluster and get the connection string');
  console.log('4. Configure the webhook in Clerk Dashboard');
} else {
  console.log('1. ✅ Environment variables are configured');
  console.log('2. Start your development server: npm run dev');
  console.log('3. Test the database connection: curl http://localhost:3000/api/test-db');
  console.log('4. Set up ngrok for local webhook testing: ngrok http 3000');
  console.log('5. Update your Clerk webhook URL with the ngrok URL');
  console.log('6. Test Google sign-in and check server logs');
}

console.log('\n📚 For detailed setup instructions, see SETUP_GUIDE.md');
