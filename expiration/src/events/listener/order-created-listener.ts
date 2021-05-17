import { Listener, OrderCreatedEvent, Subjects } from "@supeguitickets/common";
import { queueGroupName } from "./queue-name-group";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { OrderJobPayload } from "../../interfaces/order-job-payload";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName: string = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const orderJobPayload: OrderJobPayload = { orderId: data.id }
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    console.log(`waiting ${delay.toString()} milliseconds to process the job`)
    await expirationQueue.add(
      orderJobPayload,
      {
        delay: 10000
      }
    )

    msg.ack()
  }
}