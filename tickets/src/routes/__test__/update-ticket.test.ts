import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsClient } from "../../nats-client";
import { Ticket } from "../../model/ticket";

jest.mock('../../nats-client')

describe('Tickets API #component', () => {
  describe('PUT /api/tickets/:id', () => {
    const generateId = () => mongoose.Types.ObjectId().toHexString()

    test("when an invalid user tries to update a ticket, it should returns 401 unauthorized", async () => {
      const response = await request(app)
        .put(`/api/tickets/${generateId()}`)
        .send({ title: 'updated title' })

      expect(response.status).toBe(401)
    })

    test("when the ticket does not exist, it should returns 404 ticket not found", async () => {
      const response = await request(app)
        .put(`/api/tickets/${generateId()}`)
        .set('Cookie', global.signinHelper())
        .send({ title: 'updated title', price: '40'})
        
      expect(response.status).toBe(404)
    })

    test("when an invalid title, it should return 400 invalid request", async () => {
      const response = await request(app)
        .put(`/api/tickets/${generateId()}`)
        .set('Cookie', global.signinHelper())
        .send({ title: '', price: 30})
        
      expect(response.status).toBe(400)    
    })

    test("when an invalid price, it should return 400 invalid request", async () => {
      const response = await request(app)
        .put(`/api/tickets/${generateId()}`)
        .set('Cookie', global.signinHelper())
        .send({ title: 'Concert' })
        
      expect(response.status).toBe(400)   
    })

    test("when the user does not own the ticket and tries to update it, it should return 401 unauthorized", async () => {
      const ticketConcert = { title: 'Concert', price: 55 }
      const createdTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send(ticketConcert)
        .expect(201)

      const ticketUpdate = { title: 'updated title', price: 55 }
      const response = await request(app)
        .put(`/api/tickets/${createdTicket.body.id}`)
        .set('Cookie', global.signinHelper())
        .send(ticketUpdate)
        
      expect(response.status).toBe(401)
    })

    test("when valid inputs, it should update the ticket", async () => {
      const cookieSession = global.signinHelper()
      const ticketConcert = { title: 'Concert', price: 55 }
      const createdTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieSession)
        .send(ticketConcert)
        .expect(201)
    
      const ticketUpdate = { title: 'updated title', price: 55 }
      const responseUpdateTicket = await request(app)
        .put(`/api/tickets/${createdTicket.body.id}`)
        .set('Cookie', cookieSession)
        .send(ticketUpdate)

      expect(responseUpdateTicket.status).toBe(200)
      expect(responseUpdateTicket.body.title).toBe(ticketUpdate.title)
      expect(responseUpdateTicket.body.price).toBe(ticketUpdate.price)

      const responseGetTicket = await request(app)
        .get(`/api/tickets/${responseUpdateTicket.body.id}`)
      
      expect(responseGetTicket.status).toBe(200)
      expect(responseGetTicket.body.title).toBe(ticketUpdate.title)
      expect(responseGetTicket.body.price).toBe(ticketUpdate.price)
    })

    test("when valid inputs, it should update the ticket and publish the event", async () => {
      const cookieSession = global.signinHelper()
      const ticketConcert = { title: 'Concert', price: 55 }
      const createdTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieSession)
        .send(ticketConcert)
        .expect(201)
    
      const ticketUpdate = { title: 'updated title', price: 55 }
      await request(app)
        .put(`/api/tickets/${createdTicket.body.id}`)
        .set('Cookie', cookieSession)
        .send(ticketUpdate)
        .expect(200)

      expect(natsClient.client.publish).toHaveBeenCalled()
    })

    test("when the ticket is reserved, it rejects the editing", async () => {
      const cookieSession = global.signinHelper()
      const ticketConcert = { title: 'Concert', price: 55 }
      const createdTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieSession)
        .send(ticketConcert)
        .expect(201)

      const ticket = await Ticket.findById(createdTicket.body.id)
      ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString() })
      await ticket?.save()
    
      const ticketUpdate = { title: 'updated title', price: 55 }
      await request(app)
        .put(`/api/tickets/${ticket?.id}`)
        .set('Cookie', cookieSession)
        .send(ticketUpdate)
        .expect(404)
    })
  })
})