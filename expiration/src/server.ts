import { get } from "config";
import { InternalErrorServer } from "@supeguitickets/common";
import { natsClient } from "./nats-client";
import { OrderCreatedListener } from "./events/listener/order-created-listener";

const start = async() => {
  if (!get('nats.clientID')) {
    throw new InternalErrorServer('Missing the configuration for the env variable MONGO_URI')
  }

  if (!get('nats.clusterID')) {
    throw new InternalErrorServer('Missing the configuration for the env variable MONGO_URI')
  }

  if (!get('nats.url')) {
    throw new InternalErrorServer('Missing the configuration for the env variable MONGO_URI')
  }

  try {
    await natsClient.connect(
      get('nats.clusterID'),
      get('nats.clientID'),
      get('nats.url')
    )

    natsClient.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsClient.client.close());
    process.on('SIGTERM', () => natsClient.client.close());

    new OrderCreatedListener(natsClient.client).listen()
  } catch (error) {
    console.log('error init')
    console.error(error)
  }
}

start()