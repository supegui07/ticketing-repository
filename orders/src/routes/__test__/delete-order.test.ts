import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@supeguitickets/common";
import { natsClient } from "../../nats-client";


describe('Orders API #component', () => {
  describe('GET /api/orders/:id', () => {

    test("when tryinf to cancel an oreder, it marks the order as cancelled", async () => {
      // create the ticket
      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0
      })
      await ticket.save()

      const user = global.signinHelper()

      // create the order
      const orderCreated = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
      
      // canceled the order
      await request(app)
        .delete(`/api/orders/${orderCreated.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

      // fetch the order
      const fetchedOrder = await request(app)
        .get(`/api/orders/${orderCreated.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
      
      expect(fetchedOrder.body.ticket.id).toEqual(ticket.id)
      expect(fetchedOrder.body.id).toEqual(orderCreated.body.id)
      expect(fetchedOrder.body.status).toEqual(OrderStatus.Cancelled)
    })
  })

  test("when a the order was cancelled, it emits an order cancelled event", async() => {
      // create the ticket
      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0
      })
      await ticket.save()

      const user = global.signinHelper()

      // create the order
      const orderCreated = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
      
      // canceled the order
      await request(app)
        .delete(`/api/orders/${orderCreated.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

      // fetch the order
      const fetchedOrder = await request(app)
        .get(`/api/orders/${orderCreated.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
      
      expect(fetchedOrder.body.ticket.id).toEqual(ticket.id)
      expect(fetchedOrder.body.id).toEqual(orderCreated.body.id)
      expect(fetchedOrder.body.status).toEqual(OrderStatus.Cancelled)

      expect(natsClient.client.publish).toHaveBeenCalled()
  })

})