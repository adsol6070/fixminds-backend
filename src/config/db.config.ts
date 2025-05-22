import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI!;
    await mongoose.connect(dbUri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
