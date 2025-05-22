import * as amqplib from "amqplib";

type AmqpConnection = ReturnType<typeof amqplib.connect> extends Promise<
  infer T
>
  ? T
  : never;
type AmqpChannel = ReturnType<AmqpConnection["createChannel"]> extends Promise<
  infer T
>
  ? T
  : never;

let connection: AmqpConnection;
let channel: AmqpChannel;

export const connectRabbitMQ = async (
  retries = 8,
  delay = 3000
): Promise<void> => {
  while (retries) {
    try {
      console.log("RabbitMq url:", process.env.RABBITMQ_URL!);
      connection = await amqplib.connect(process.env.RABBITMQ_URL!);
      channel = await connection.createChannel();
      console.info("✅ RabbitMQ connected successfully");
      return;
    } catch (error) {
      console.error("❌ Failed to connect to RabbitMQ", error);
      retries--;
      if (!retries) {
        console.error("❌ All retry attempts failed.");
        process.exit(1);
      }
      console.log(
        `🔁 Retrying in ${delay / 1000}s... (${retries} retries left)`
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export const getRabbitMQChannel = (): AmqpChannel => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized.");
  }
  return channel;
};

export const closeRabbitMQ = async (): Promise<void> => {
  try {
    await channel.close();
    await connection.close();
    console.info("🔌 RabbitMQ connection closed");
  } catch (error) {
    console.error("❌ Failed to close RabbitMQ connection", error);
  }
};
