import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ExpirationCompletedEvent, OrderStatus } from "@supeguitickets/common";
import { natsClient } from "../../../nats-client"
import { Ticket } from "../../../models/ticket";
import { ExpirationCompletedListener } from "../expiration-completed-listener";
import { Order } from "../../../models/order";

describe('Orders API #component', () => {
  describe('expiration completed listener', () => {

    const setup = async () => {
      // creating the listener for expiration
      const listener = new ExpirationCompletedListener(natsClient.client)

      // creating the ticket for the order
      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'talk',
        price: 20,
        version: 0
      })
      await ticket.save()

      // creating the order with the reserved ticket
      const order = Order.build({
        userId: "12345",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
      })
      await order.save()

      const data: ExpirationCompletedEvent['data'] = {
        orderId: order.id
      }

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }
      
      return { listener, data, msg, order }
    }

    test("when expiration completed event arrives, it cancells the order", async () => {
      const { listener, data, msg, order } = await setup()

      await listener.onMessage(data, msg)

      const updatedOrder = await Order.findById(order.id)

      expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
    })

    test("when expiration completed event arrives, it publish/emit an order cancelled event", async () => {
      const { listener, data, msg, order } = await setup()

      await listener.onMessage(data, msg)

      const publishedEventData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[1][1])
      expect(publishedEventData.id).toEqual(order.id)
      expect(natsClient.client.publish).toHaveBeenCalled()
    })

    test("when expiration completed event arrives, it acks the message", async () => {
      const { listener, data, msg } = await setup()

      await listener.onMessage(data, msg)

      expect(msg.ack).toHaveBeenCalled()
    })
  })
})