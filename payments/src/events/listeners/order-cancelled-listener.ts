import { Listener, OrderCancelledEvent, Subjects, OrderStatus } from "@supeguitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/orders";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName: string = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id, version } = data

    const order = await Order.findOne({
      _id: id,
      version: version - 1
    })

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    msg.ack()
  }
}