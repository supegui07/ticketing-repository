import { Listener, ExpirationCompletedEvent, Subjects, OrderStatus } from "@supeguitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted
  queueGroupName: string = queueGroupName

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const { orderId } = data
    const order = await Order.findById(orderId).populate("ticket")

    if (!order) {
      throw new Error("Order not found")
    }

    if(order.status === OrderStatus.Completed) {
      return msg.ack()
    }

    order.set({ 
      status: OrderStatus.Cancelled,
    })
    await order.save()

    const { id, version, ticket } = order
    await new OrderCancelledPublisher(this.client).publish({
      id,
      version,
      ticket: {
        id: ticket.id
      }
    })

    msg.ack()
    console.log('ExpirationCompletedListener acked the message.')
  }
}