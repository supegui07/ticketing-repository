import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { requireAuth, NotFoundError, validateRequest, UnauthorizedRequestError, BadRequestError } from "@supeguitickets/common";
import { Ticket } from "../model/ticket";
import { natsClient } from "../nats-client";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router()

router.put('/api/tickets/:id',
  requireAuth,
  [
    param('id')
      .not()
      .isEmpty()
        .withMessage('Ticket must be provided'),
    body('title')
      .not()
      .isEmpty()
        .withMessage('Title must be provided'),
    body('price')
      .notEmpty()
        .withMessage('Price must be provided')
      .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async(req: Request, res: Response) => {
    const ticketId = req.params.id
    const { title, price } = req.body

    const ticket = await Ticket.findOne({
      _id: ticketId
    })

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedRequestError()
    }

    ticket.set({
      title,
      price
    })

    await ticket.save()
    new TicketUpdatedPublisher(natsClient.client)
    .publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

    res.send(ticket)
})

export { router as UpdateTicketRouter }