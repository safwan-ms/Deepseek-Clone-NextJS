// Test script to verify webhook functionality
// Run with: node test-webhook.js

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  try {
    const response = await fetch(`${baseUrl}/api/test-db`);
    const data = await response.json();
    console.log('✅ Database connection:', data.message);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testDebugWebhook() {
  console.log('🔍 Testing debug webhook...');
  try {
    const testUser = {
      userId: 'test_user_' + Date.now(),
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      imageUrl: 'https://example.com/avatar.jpg',
      eventType: 'user.created'
    };

    const response = await fetch(`${baseUrl}/api/debug-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Debug webhook test passed:', data.message);
      console.log('👤 User created:', data.user);
      return data.user;
    } else {
      console.error('❌ Debug webhook test failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Debug webhook test error:', error.message);
    return null;
  }
}

async function testGetUsers() {
  console.log('🔍 Testing get users...');
  try {
    const response = await fetch(`${baseUrl}/api/users`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Get users test passed. Found', data.count, 'users');
      data.users.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
      });
      return data.users;
    } else {
      console.error('❌ Get users test failed:', data.message);
      return [];
    }
  } catch (error) {
    console.error('❌ Get users test error:', error.message);
    return [];
  }
}

async function runTests() {
  console.log('🚀 Starting webhook tests...\n');
  
  // Test 1: Database connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('❌ Stopping tests - database connection failed');
    return;
  }
  
  console.log('');
  
  // Test 2: Debug webhook
  const user = await testDebugWebhook();
  
  console.log('');
  
  // Test 3: Get users
  await testGetUsers();
  
  console.log('\n🎉 Tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure your Clerk webhook is configured to point to /api/clerk');
  console.log('2. Verify SIGNING_SECRET environment variable is set');
  console.log('3. Test with actual Google sign-in');
  console.log('4. Check server logs for webhook events');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testDatabaseConnection, testDebugWebhook, testGetUsers };