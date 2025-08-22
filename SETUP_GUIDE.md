# Clerk + MongoDB Setup Guide

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Clerk Webhook
SIGNING_SECRET=whsec_your_webhook_signing_secret_here

# MongoDB Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_database_name?retryWrites=true&w=majority
```

## Clerk Dashboard Configuration

1. **Get your Clerk Keys:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Select your application
   - Go to "API Keys" in the sidebar
   - Copy the "Publishable Key" and "Secret Key"

2. **Configure Webhook:**
   - In Clerk Dashboard, go to "Webhooks" in the sidebar
   - Click "Add Endpoint"
   - Set the endpoint URL to: `https://your-domain.com/api/clerk`
   - For local development, use: `https://your-ngrok-url.ngrok.io/api/clerk`
   - Select these events:
     - `user.created`
     - `user.updated`
     - `user.deleted`
   - Copy the "Signing Secret" and add it to your `.env.local`

3. **Enable Google OAuth:**
   - In Clerk Dashboard, go to "User & Authentication" → "Social Connections"
   - Enable Google
   - Configure your Google OAuth credentials

## MongoDB Setup

1. **Create MongoDB Atlas Cluster:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new cluster
   - Create a database user with read/write permissions
   - Get your connection string

2. **Test Database Connection:**
   - Start your development server: `npm run dev`
   - Visit: `http://localhost:3000/api/test-db`
   - You should see a success response

## Testing the Setup

1. **Test Database Connection:**
   ```bash
   curl http://localhost:3000/api/test-db
   ```

2. **Test Webhook (using ngrok for local development):**
   - Install ngrok: `npm install -g ngrok`
   - Start ngrok: `ngrok http 3000`
   - Update your Clerk webhook URL with the ngrok URL
   - Sign in with Google and check your server logs

## Common Issues & Solutions

### Issue: "SIGNING_SECRET is not configured"
**Solution:** Make sure you've added the webhook signing secret to your `.env.local` file.

### Issue: "Database connection failed"
**Solution:** 
- Check your `MONGODB_URI` format
- Ensure your MongoDB Atlas cluster is accessible
- Verify your database user has the correct permissions

### Issue: "Webhook verification failed"
**Solution:**
- Ensure the webhook URL in Clerk dashboard matches your endpoint
- Check that the signing secret is correct
- For local development, use ngrok to expose your local server

### Issue: User data not being saved
**Solution:**
- Check server logs for detailed error messages
- Verify the webhook is being triggered (check Clerk dashboard webhook logs)
- Ensure your MongoDB connection is working

## Debugging Steps

1. **Check Environment Variables:**
   ```bash
   # Add this to your webhook route temporarily
   console.log("Environment check:", {
     hasSigningSecret: !!process.env.SIGNING_SECRET,
     hasMongoUri: !!process.env.MONGODB_URI,
     mongoUriLength: process.env.MONGODB_URI?.length
   });
   ```

2. **Monitor Webhook Calls:**
   - Check your server logs when users sign in
   - Look for the detailed logging I added to the webhook handler

3. **Verify Database Operations:**
   - Use the test endpoint: `/api/test-db`
   - Check MongoDB Atlas dashboard for new documents

## Production Deployment

1. **Set Environment Variables:**
   - Add all environment variables to your hosting platform (Vercel, Netlify, etc.)
   - Update the webhook URL to your production domain

2. **Update Webhook URL:**
   - In Clerk Dashboard, update the webhook endpoint to your production URL
   - Example: `https://your-app.vercel.app/api/clerk`

3. **Test Production:**
   - Sign in with Google on your production site
   - Check your production logs for webhook events
   - Verify user data is being saved to your production database
