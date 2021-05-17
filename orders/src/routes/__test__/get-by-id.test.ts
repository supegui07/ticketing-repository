import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@supeguitickets/common";



describe('Orders API #component', () => {
  describe('GET /api/orders/:id', () => {

    test("when calling to /api/tickets:id, it fetches the order", async () => {
      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0
      })
      await ticket.save()

      const user = global.signinHelper()

      const orderCreated = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
      
      const fetchedOrder = await request(app)
        .get(`/api/orders/${orderCreated.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
      
      expect(fetchedOrder.body.ticket.id).toEqual(ticket.id)
      expect(fetchedOrder.body.id).toEqual(orderCreated.body.id)
    })
  })

  test("when tring to fetch a ticket that does not belong to the user, it response with an error", async () => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
      version: 0
    })
    await ticket.save()

    const userOne = global.signinHelper()

    const orderCreated = await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticket.id })
      .expect(201)
    
    const userTwo = global.signinHelper()

    await request(app)
      .get(`/api/orders/${orderCreated.body.id}`)
      .set('Cookie', userTwo)
      .send()
      .expect(401)
  })
})