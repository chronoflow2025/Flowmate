import mongoose from 'mongoose';

// Keep a cached connection across hot reloads in development
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var _mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowmate';

export async function connectMongoose() {
  if (global._mongoose && global._mongoose.connection && global._mongoose.connection.readyState) {
    return global._mongoose;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoose.set('strictQuery', false);

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // sensible defaults; tweak if needed
      maxPoolSize: 10,
    });

    global._mongoose = mongoose;
    return mongoose;
  } catch (err) {
    console.error('Failed to connect mongoose:', err);
    throw err;
  }
}

export default mongoose;
