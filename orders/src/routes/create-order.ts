import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from "@supeguitickets/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsClient } from "../nats-client";

const EXPIRATION_WINDOW_SECONDS = 1 * 60

const router = express.Router()

router.post('/api/orders',
  requireAuth,
  [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()

    if (isReserved) {
      throw new BadRequestError('The ticket is already reserved')
    }

    // calculate the expiration date
    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // build the order and save it
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expirationDate,
      ticket
    })

    await order.save()

    // publish an event (an order was created)
    new OrderCreatedPublisher(natsClient.client)
      .publish({
        id: order.id,
        version: order.version,
        orderStatus: order.status,
        userId: req.currentUser!.id,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price
        }
      })

    res.status(201).send(order)
})

export { router as createOrderRouter }