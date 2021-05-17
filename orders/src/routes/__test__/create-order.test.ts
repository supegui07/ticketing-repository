import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@supeguitickets/common";
import { natsClient } from "../../nats-client";

describe('Orders API #component', () => {
  describe('POST /api/orders', () => {
    test("when calling to /api/tickets, it should returns an status code different to 404 due to the route exists", async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({})
      
      expect(response.status).not.toEqual(404)
    })

    test("when ticket does not exist, it should returns a status code 404 due to the ticket was not found", async () => {
      const order = { ticketId: mongoose.Types.ObjectId() }
      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signinHelper())
        .send(order)
      
      expect(response.status).toEqual(404)
    })

    test("when ticket is already reserved, it should returns a error", async () => {
      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0
      })
      await ticket.save()

      const order = Order.build({
        ticket,
        userId: '0012234599',
        status: OrderStatus.Created,
        expiresAt: new Date()
      })
      await order.save()

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signinHelper())
        .send({ ticketId: ticket.id })

      expect(response.status).toEqual(404)
    })

    test("when a valid payload, it reserves the ticket and it creates the order", async () => {
      const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        version: 0
      })
      await ticket.save()

      const ordersBefore = await Order.find({})

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signinHelper())
        .send({ ticketId: ticket.id })

      const ordersAfter = await Order.find({})

      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual(OrderStatus.Created)
      expect(response.body.ticket.title).toEqual(ticket.title)
      expect(ordersAfter.length).toEqual(ordersBefore.length + 1)
    })
  })

  test("when a valid payload, it emits an order created event", async() => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
      version: 0
    })
    await ticket.save()

    const ordersBefore = await Order.find({})

    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signinHelper())
      .send({ ticketId: ticket.id })

    const ordersAfter = await Order.find({})

    expect(response.status).toEqual(201)
    expect(response.body.status).toEqual(OrderStatus.Created)
    expect(response.body.ticket.title).toEqual(ticket.title)
    expect(ordersAfter.length).toEqual(ordersBefore.length + 1)

    expect(natsClient.client.publish).toHaveBeenCalled()
  })

})