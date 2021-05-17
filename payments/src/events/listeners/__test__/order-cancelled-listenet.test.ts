import { OrderCreatedEvent, Subjects, OrderStatus, OrderCancelledEvent } from "@supeguitickets/common";
import { OrderCreatedListener } from "../order-created-listener"
import { natsClient } from "../../../nats-client"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/orders";
import { OrderCancelledListener } from "../order-cancelled-listener";

describe('Payments API #component', () => {
  describe('Order cancelled listener', () => {

    const setup = async () => {
      // create instance of the listener
      const listener = new OrderCancelledListener(natsClient.client)

      const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: '1234',
        status: OrderStatus.Created,
        price: 500
      })
      await order.save()

      // create the fake data event
      const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString()
        }
      }

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }

      return { listener, data, msg }
    }

    test("when a order cancelled event arrives, it updates the order status to cancelled", async () => {
      const { listener, data, msg } = await setup()

      await listener.onMessage(data, msg)

      const { id } = data
      const updatedOrder = await Order.findById(id)

      expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
    })

    test("when a order cancelled event arrives, it acks the message", async () => {
      const { listener, data, msg } = await setup()

      await listener.onMessage(data, msg)

      expect(msg.ack).toHaveBeenCalled()
    })
  })
})