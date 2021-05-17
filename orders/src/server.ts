import mongoose from "mongoose";
import { app } from "./app";
import { get } from "config";
import { InternalErrorServer } from "@supeguitickets/common";
import { natsClient } from "./nats-client";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompletedListener } from "./events/listeners/expiration-completed-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async() => {
  if (!get('jwtConfig.secretKey')) {
    throw new InternalErrorServer('Missing the configuration for the env variable JWT_KEY')
  }

  if (!get('mongo.uri')) {
    throw new InternalErrorServer('Missing the configuration for the env variable MONGO_URI')
  }

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

    new TicketCreatedListener(natsClient.client).listen()
    new TicketUpdatedListener(natsClient.client).listen()
    new ExpirationCompletedListener(natsClient.client).listen()
    new PaymentCreatedListener(natsClient.client).listen()

    await mongoose.connect(get('mongo.uri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB to the tickets db')
  } catch (error) {
    console.log('error init')
    console.error(error)
  }

  app.listen(3003, () => {
    console.log(`Tickets service listening on port 3003...`)
  })
}

start()