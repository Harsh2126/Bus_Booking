import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busbooking3';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function dbConnect() {
  let cached = (global as typeof global & { mongoose?: { conn: unknown; promise: unknown } }).mongoose;

  if (!cached) {
    (global as typeof global & { mongoose?: { conn: unknown; promise: unknown } }).mongoose = { conn: null, promise: null };
    cached = (global as typeof global & { mongoose?: { conn: unknown; promise: unknown } }).mongoose;
  }

  if (!cached) {
    throw new Error('Could not initialize mongoose cache');
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'busbooking3',
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect; 