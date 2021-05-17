import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

describe('Tickets API #component', () => {
  describe('GET /api/tickets/:id', () => {
    test("when a ticket is not found, it should returns a 404 not found", async () => {
      const id = new mongoose.Types.ObjectId().toHexString()
      const response = await request(app)
        .get(`/api/tickets/${id}`)

      expect(response.status).toBe(404)
    })

    test("when a ticket found, it should returns a 200 with the ticket", async () => {
      const responseCreateTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send({ title: 'Talk', price: 30 })

      expect(responseCreateTicket.status).toBe(201)

      const createdTicket = responseCreateTicket.body
      const { id } = createdTicket

      const responseGetById = await request(app)
        .get(`/api/tickets/${id}`)

      expect(responseGetById.status).toBe(200)
      expect(responseGetById.body).toEqual(createdTicket)
      // const 
    })
  })
})