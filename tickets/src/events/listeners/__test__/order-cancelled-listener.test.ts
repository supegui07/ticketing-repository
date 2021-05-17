import { OrderCancelledEvent } from "@supeguitickets/common";
import { natsClient } from "../../../nats-client"
import { Ticket } from "../../../model/ticket"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

describe('Tickets API #component', () => {
  describe('Order created listener', () => {

    const setup = async () => {
      // create instance of the listener
      const listener = new OrderCancelledListener(natsClient.client)

      // create and save the ticket
      const orderId = mongoose.Types.ObjectId().toHexString()
      const ticket = Ticket.build({
        title: 'movie',
        price: 20,
        userId: '123',
      })
      ticket.set({ orderId })
      await ticket.save()

      // create the fake data event
      const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
          id: ticket.id,
        }
      }

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }

      return { listener, ticket, data, msg }
    }

    test("when a order cancelled event arrives, it publishes an event with the new version", async () => {
      const { listener, ticket, data, msg } = await setup()

      await listener.onMessage(data, msg)
      await Ticket.findById(ticket.id)

      expect(natsClient.client.publish).toHaveBeenCalled()

      const updateTicket = await Ticket.findById(ticket.id)

      expect(updateTicket?.orderId).not.toBeDefined()

      expect(msg.ack).toHaveBeenCalled()
      expect(natsClient.client.publish).toHaveBeenCalled()

    })
  })
})