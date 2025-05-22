import { Channel } from "amqplib";
import { getRabbitMQChannel } from "../../config/rabbitmq.config";
import { EmailPayload } from "../../common/types/email.type";

export const publishEmail = async (queue: string, payload: EmailPayload) => {
  const channel: Channel = await getRabbitMQChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
};
