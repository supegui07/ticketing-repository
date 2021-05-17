import { Listener, PaymentCreatedEvent, Subjects, OrderStatus } from "@supeguitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  queueGroupName: string = queueGroupName
  
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data
    const order = await Order.findOne({ id: orderId })

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Completed })
    await order.save()

    msg.ack()
  }
}