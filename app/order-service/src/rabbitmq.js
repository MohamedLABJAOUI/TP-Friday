const amqp = require('amqplib');

let channel = null;

async function connect() {
  if (channel) return channel;
  const conn = await amqp.connect('amqp://user:password@rabbitmq:5672/');
  channel = await conn.createChannel();
  return channel;
}

async function publishToQueue(queue, message) {
  const ch = await connect();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
}

module.exports = { publishToQueue }; 