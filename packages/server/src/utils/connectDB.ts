import mongoose from "mongoose";

const dbUrl = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@localhost:6000/lucella?authSource=admin`;
// const dbUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.3zx0rpz.mongodb.net/?retryWrites=true&w=majority`;
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected...");
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
