import Queue from 'bull'
import { get } from "config";
import { OrderJobPayload } from '../interfaces/order-job-payload';
import { ExpirationCompletedPublisher } from '../events/publisher/expiration-completed-publisher';
import { natsClient } from '../nats-client';

// initialing the queue job
// first param: bucket name where the jobs are going to be allocated
// second param: options to connect to redis server
const expirationQueue = new Queue<OrderJobPayload>('order:expiration', {
  redis: {
    host: get('redis.host')
  }
})

expirationQueue.process(async (job) => {
  console.log('I want to publish an expiration:complete event for orderId ', job.data?.orderId)

  const { orderId } = job.data
  new ExpirationCompletedPublisher(natsClient.client).publish({
    orderId
  })
})

export { expirationQueue }