# Clerk Webhook Troubleshooting Guide

## Issues Fixed

### 1. Schema Mismatch
- **Problem**: User model expected `_id` field but webhook was creating `clerkId`
- **Solution**: Updated webhook to use `_id: data.id` to match the schema

### 2. Improper Error Handling
- **Problem**: No error handling in webhook route
- **Solution**: Added comprehensive try-catch blocks and logging

### 3. Incorrect Update/Delete Operations
- **Problem**: Wrong field references in update/delete operations
- **Solution**: Fixed to use correct `data.id` for operations

### 4. Missing Duplicate Handling
- **Problem**: No handling for duplicate user creation
- **Solution**: Added checks for existing users and duplicate key error handling

## Environment Variables Required

Make sure these are set in your `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
SIGNING_SECRET=your_clerk_webhook_signing_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Clerk Dashboard Configuration

1. Go to your Clerk Dashboard
2. Navigate to "Webhooks" section
3. Create a new webhook endpoint: `https://yourdomain.com/api/clerk`
4. Subscribe to these events:
   - `user.created`
   - `user.updated` 
   - `user.deleted`
5. Copy the signing secret to your environment variables

## Testing the Fix

### Option 1: Run the Test Script
```bash
node test-webhook.js
```

### Option 2: Manual Testing

1. **Test Database Connection**:
   ```bash
   curl http://localhost:3000/api/test-db
   ```

2. **Test Debug Webhook**:
   ```bash
   curl -X POST http://localhost:3000/api/debug-webhook \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "test_123",
       "email": "test@example.com",
       "firstName": "Test",
       "lastName": "User",
       "eventType": "user.created"
     }'
   ```

3. **Check Users**:
   ```bash
   curl http://localhost:3000/api/users
   ```

## Debugging Real Webhooks

### Check Server Logs
Look for these log messages:
- `Processing webhook event: user.created for user: email@example.com`
- `User created successfully: user_id`
- `MongoDB connected successfully✅`

### Common Issues

1. **Webhook Not Receiving Events**:
   - Verify webhook URL in Clerk Dashboard
   - Check if endpoint is publicly accessible
   - Verify signing secret is correct

2. **Database Connection Issues**:
   - Check MONGODB_URI environment variable
   - Ensure MongoDB instance is running and accessible
   - Check network connectivity

3. **User Creation Fails**:
   - Check server logs for specific error messages
   - Verify User model schema matches data structure
   - Check for validation errors

### Webhook Payload Example
```json
{
  "data": {
    "id": "user_2abc123def456",
    "email_addresses": [
      {
        "email_address": "user@example.com"
      }
    ],
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://example.com/avatar.jpg"
  },
  "type": "user.created"
}
```

## Additional Debug Endpoints

- `GET /api/debug-webhook` - Shows current users and tests DB connection
- `POST /api/debug-webhook` - Simulates webhook events for testing
- `GET /api/users` - Lists all users in database
- `POST /api/users` - Manual user creation for testing

## Monitoring

Add these to your monitoring:
- Webhook endpoint response times
- Database connection health
- User creation success/failure rates
- Error logs for webhook processing

## Next Steps After Fix

1. Test with actual Google sign-in
2. Monitor server logs during sign-in process
3. Verify user data appears in MongoDB
4. Set up proper error alerting
5. Consider adding user profile sync for updates