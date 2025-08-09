import mongoose, { Mongoose } from "mongoose";

// Cache the Mongoose connection across hot reloads in development
type CachedMongoose = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var _mongoose: CachedMongoose | undefined;
}

const cached: CachedMongoose = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export const connectDB = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI!;
    cached.promise = mongoose.connect(uri);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully✅");
  } catch (error) {
    cached.conn = null;
    console.log("MongoDB connection failed! ❌", error);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
