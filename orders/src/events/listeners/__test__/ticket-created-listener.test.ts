import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@supeguitickets/common";
import { natsClient } from "../../../nats-client"
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

describe('Orders API #component', () => {
  describe('ticket created listener', () => {

    const setup = () => {
      const listener = new TicketCreatedListener(natsClient.client)

      const data: TicketCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'movie',
        price: 10,
        userId: '123'
      }

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }
      
      return { listener, data, msg }
    }

    test("when ticket created event arrives, it creates and saves the ticket", async () => {
      const { listener, data, msg } = setup()

      await listener.onMessage(data, msg)
      const ticket = await Ticket.findById(data.id)

      expect(ticket?.title).toEqual(data.title)
      expect(ticket?.price).toEqual(data.price)
    })

    test("when ticket created event arrives, it acks the message", async () => {
      const { listener, data, msg } = setup()

      await listener.onMessage(data, msg)
      await Ticket.findById(data.id)

      expect(msg.ack).toHaveBeenCalled()
    })
  })
})