import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config";
import { connectRabbitMQ } from "./config/rabbitmq.config";
import { consumeEmailQueue } from "./messaging/consumers/email.consumer";

dotenv.config();

export const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;

    await connectDB();
    await connectRabbitMQ();
    await consumeEmailQueue();

    app.listen(PORT, () => {
      console.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed", error);
    process.exit(1);
  }
};
