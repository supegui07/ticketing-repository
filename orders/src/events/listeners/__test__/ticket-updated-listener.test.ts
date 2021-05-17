import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@supeguitickets/common";
import { natsClient } from "../../../nats-client"
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

describe('Orders API #component', () => {
  describe('ticket created listener', () => {

    const setup = async () => {
      const listener = new TicketUpdatedListener(natsClient.client)

      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'talk',
        price: 20,
        version: 0
      })
      await ticket.save()

      const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'movie',
        price: 10,
        userId: '123'
      }

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }

      return { listener, data, msg, ticket }
    }

    test("when ticket updated event arrives, it updates and saves the ticket", async () => {
      const { listener, data, msg, ticket } = await setup()

      await listener.onMessage(data, msg)
      const updatedTicket = await Ticket.findById(ticket.id)

      expect(updatedTicket?.title).toEqual(data.title)
      expect(updatedTicket?.price).toEqual(data.price)
      expect(updatedTicket?.version).toEqual(data.version)
    })

    test("when ticket updated event arrives, it acks the message", async () => {
      const { listener, data, msg, ticket } = await setup()

      await listener.onMessage(data, msg)
      await Ticket.findById(ticket.id)

      expect(msg.ack).toHaveBeenCalled()
    })

    test("when ticket updated event has a skipped version, it does not acks the message", async () => {
      const { listener, data, msg } = await setup()

      data.version = 10

      try {
        await listener.onMessage(data, msg)
      } catch (error) { }

      expect(msg.ack).not.toHaveBeenCalled()
    })
  })
})