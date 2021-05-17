import { OrderCreatedEvent, Subjects, OrderStatus } from "@supeguitickets/common";
import { OrderCreatedListener } from "../order-created-listener"
import { natsClient } from "../../../nats-client"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/orders";

describe('Payments API #component', () => {
  describe('Order created listener', () => {

    const setup = async () => {
      // create instance of the listener
      const listener = new OrderCreatedListener(natsClient.client)

      // create the fake data event
      const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        orderStatus: OrderStatus.Created,
        userId: '123',
        expiresAt: new Date().setSeconds(15 * 60).toString(),
        ticket: {
          id: mongoose.Types.ObjectId().toHexString(),
          price: 500
        }
      }

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }

      return { listener, data, msg }
    }

    test("when a order created event arrives, it replicates the order", async () => {
      const { listener, data, msg } = await setup()

      await listener.onMessage(data, msg)

      const { id, ticket } = data
      const order = await Order.findById(id)

      expect(order?.price).toEqual(ticket.price)
    })

    test("when a order created event arrives, it acks the message", async () => {
      const { listener, data, msg } = await setup()

      await listener.onMessage(data, msg)

      expect(msg.ack).toHaveBeenCalled()
    })
  })
})