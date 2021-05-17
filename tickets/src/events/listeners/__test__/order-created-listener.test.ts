import { OrderCreatedEvent, Subjects, OrderStatus } from "@supeguitickets/common";
import { OrderCreatedListener } from "../order-created-listener"
import { natsClient } from "../../../nats-client"
import { Ticket } from "../../../model/ticket"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

describe('Tickets API #component', () => {
  describe('Order created listener', () => {

    const setup = async () => {
      // create instance of the listener
      const listener = new OrderCreatedListener(natsClient.client)

      // create and save the ticket
      const ticket = Ticket.build({
        title: 'movie',
        price: 20,
        userId: '123'
,      })
      await ticket.save()

      // create the fake data event
      const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        orderStatus: OrderStatus.Created,
        userId: '123',
        expiresAt: new Date().setSeconds(15 * 60).toString(),
        ticket: {
          id: ticket.id,
          price: ticket.price
        }
      }

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn()
      }

      return { listener, ticket, data, msg }
    }

    test("when a order created event arrives, it publishes an event with the new version", async () => {
      const { listener, ticket, data, msg } = await setup()

      await listener.onMessage(data, msg)
      await Ticket.findById(ticket.id)

      expect(natsClient.client.publish).toHaveBeenCalled()

      const ticketUpdatedData = JSON.parse(
        (natsClient.client.publish as jest.Mock).mock.calls[0][1]
      )

      expect(data.id).toEqual(ticketUpdatedData.orderId)
    })

    test("when a order created event arrives, it sets the orderId of the ticket", async () => {
      const { listener, ticket, data, msg } = await setup()

      await listener.onMessage(data, msg)
      const updatedTicket = await Ticket.findById(ticket.id)

      expect(updatedTicket?.orderId).toEqual(data.id)
    })

    test("when a order created event arrives, it ack the message", async () => {
      const { listener, ticket, data, msg } = await setup()

      await listener.onMessage(data, msg)
      await Ticket.findById(ticket.id)

      expect(msg.ack).toHaveBeenCalled()
    })
  })
})