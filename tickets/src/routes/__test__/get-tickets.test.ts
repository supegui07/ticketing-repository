import request from 'supertest'
import { app } from "../../app";
import { TicketAttrs } from '../../interfaces/mongo-ticket-attrs';

describe('Tickets API #component', () => {
  describe('GET /api/tickets', () => {
    const createTicket = (ticket: any) => {
      return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signinHelper())
        .send(ticket)
        .expect(201)
    }
    
    test("when requesting all tickets, it should returns the list of tickets", async () => {
      const ticketConcert = { title: 'Concert', price: 20 }
      const ticketTalk = { title: 'Talk', price: 40 }
      const ticketEvent = { title: 'Event', price: 60 }

      await createTicket(ticketConcert)
      await createTicket(ticketTalk)
      await createTicket(ticketEvent)

      const response = await request(app)
        .get('/api/tickets')
  
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(3)

    })
  })
})