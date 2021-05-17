import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@supeguitickets/common";
import { Ticket } from "../model/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsClient } from "../nats-client";
const router = express.Router()

router.post('/api/tickets',
requireAuth, 
[
  body('title')
    .not()
    .isEmpty()
      .withMessage('Title must be provided'),
  body('price')
    .not()
    .isEmpty()
      .withMessage('Price must be provided')
    .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
],
validateRequest,
async (req: Request, res:Response) => {
  const { title, price } = req.body

  const ticket = Ticket.build({ 
    title,
    price,
    userId: req.currentUser!.id
  })

  await ticket.save()
  await new TicketCreatedPublisher(natsClient.client)
    .publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

  res.status(201).send(ticket)
})

export { router as createTicketRouter }