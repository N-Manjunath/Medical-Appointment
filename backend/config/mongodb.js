import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI; // use the correct env var
  // console.log("MONGO_URI:", uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
