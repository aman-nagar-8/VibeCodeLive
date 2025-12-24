import mongoose from "mongoose";

const MONGODB_URI = process.env.mongodbURI

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {

  try {
    if (cached.conn) return cached.conn;
    console.log("trying connection");
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
      console.log("connected to mongoDB Atlas");
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error : ", error);
  }
}