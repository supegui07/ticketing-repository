import { Listener, OrderCreatedEvent, Subjects } from "@supeguitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/orders";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName: string = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, ticket, orderStatus, userId, version } = data
    const order = Order.build({
      id,
      price: ticket.price,
      status: orderStatus,
      userId,
      version
    })
    await order.save()

    msg.ack()
  }
}