import mongoose from "mongoose";

// Extend the global namespace to include mongoose caching
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully✅");
  } catch (error) {
    console.log("MongoDB connection failed! ❌", error);
  }
  return cached.conn;
};

export default connectDB;
