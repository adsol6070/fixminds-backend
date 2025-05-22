import { Channel, ConsumeMessage } from "amqplib";
import { sendEmail } from "../../common/services/email.service";
import { getRabbitMQChannel } from "../../config/rabbitmq.config";
import { EmailPayload } from "../../common/types/email.type";

export const consumeEmailQueue = async () => {
  const channel: Channel = await getRabbitMQChannel();

  await channel.assertQueue("email.quoteUser", { durable: true });
  await channel.assertQueue("email.quote", { durable: true });
  await channel.assertQueue("email.verify", { durable: true });
  await channel.assertQueue("email.reset", { durable: true });

  const onMessage = async (msg: ConsumeMessage | null) => {
    if (msg) {
      const payload: EmailPayload = JSON.parse(msg.content.toString());
      try {
        if (payload.attachments) {
          payload.attachments = payload.attachments.map((att) => ({
            ...att,
            content: typeof att.content === 'string' ? Buffer.from(att.content, 'base64') : att.content,
          }));
        }

        await sendEmail(payload);
        console.info(`Email sent to ${payload.to}`);
        channel.ack(msg);
      } catch (err) {
        console.error(`Failed to send email to ${payload.to}: ${err}`);
        channel.nack(msg, false, false);
      }
    }
  };

  channel.consume("email.quoteUser", onMessage, { noAck: false });
  channel.consume("email.quote", onMessage, { noAck: false });
  channel.consume("email.verify", onMessage, { noAck: false });
  channel.consume("email.reset", onMessage, { noAck: false });
};
