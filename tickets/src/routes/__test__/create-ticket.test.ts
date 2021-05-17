import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { natsClient } from "../../nats-client";

describe('Tickets API #component', () => {
  describe('POST /api/tickets', () => {
    test("when calling to /api/tickets, it should returns an status code different to 404 due to the route exists", async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({})
      
      expect(response.status).not.toEqual(404)
    })

    test("when a user is not signed in, it should returns a 401 unauthorized", async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({})

      expect(response.status).toBe(401)
    })

    test("when a user is signed in, it should returns a status code different 401 unauthorized", async () => {
      const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({})

      expect(response.status).not.toEqual(401)
    })

    test("when an invalid title is provided, it should returns an error", async () => {
      const responseEmptyTitle = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({ 
          title: '',
          price: 10
        })
      
      const responseTitleNotExist = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({ 
          price: 10
        })

      expect(responseEmptyTitle.status).toBe(400)
      expect(responseTitleNotExist.status).toBe(400)
    })

    test("when an invalid price is provided, it should returns an error", async () => {
      const responseEmptyPrice = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({ 
          title: 'Concert'
        })

      const responsePriceLessThan0 = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({
          title: 'Concert',
          price: -10
        })

      expect(responseEmptyPrice.status).toBe(400)
      expect(responsePriceLessThan0.status).toBe(400)
    })

    test("when valid inputs, it should create a ticket", async () => {
      let ticketsBefore = await Ticket.find({})

      const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({
          title: 'Concert',
          price: 20
        })

      let ticketsAfter = await Ticket.find({})
      
      expect(response.status).toBe(201)
      expect(ticketsAfter.length).toEqual(ticketsBefore.length + 1)
      expect(ticketsAfter[0].title).toEqual('Concert')
      expect(ticketsAfter[0].price).toEqual(20)
    })

    test("when valid inputs, it should create a ticket and publish a new event", async () => {
      const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({
          title: 'Concert',
          price: 20
        })

      expect(response.status).toBe(201)
      expect(natsClient.client.publish).toHaveBeenCalled()

    })
  })
})