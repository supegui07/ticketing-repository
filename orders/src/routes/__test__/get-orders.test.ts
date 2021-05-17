import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@supeguitickets/common";



describe('Orders API #component', () => {
  describe('GET /api/orders', () => {
    const buildTicket = async () => {
      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0
      })
      await ticket.save()

      return ticket
    }
    test("when calling to /api/tickets, it fetches orders for a particular user", async () => {
      const ticketOne = await buildTicket()
      const ticketTwo = await buildTicket()
      const ticketThree = await buildTicket()

      const userOne = global.signinHelper()
      const userTwo = global.signinHelper()

      await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })

      await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })

      await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })

      const { body: orderOne } = await request(app)
        .get('/api/orders')
        .set('Cookie', userOne)
        .expect(200)

      const { body: orderTwo } = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200)

      expect(orderOne.length).toEqual(1)
      expect(orderOne[0].ticket.id).toEqual(ticketOne.id)

      expect(orderTwo.length).toEqual(2)
      expect(orderTwo[0].ticket.id).toEqual(ticketTwo.id)
      expect(orderTwo[1].ticket.id).toEqual(ticketThree.id)
    })
  })
})