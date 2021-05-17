import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, UnauthorizedRequestError, OrderStatus } from "@supeguitickets/common";
import { Order } from "../models/order";
import { natsClient } from "../nats-client";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Ticket } from "../models/ticket";

const router = express.Router()

router.delete('/api/orders/:id', 
requireAuth,
async (req: Request, res: Response) => {
  const { id } = req.params
  const order = await Order.findById(id).populate('ticket')
  
  if(!order) {
    throw new NotFoundError()
  }

  if(order.userId !== req.currentUser!.id) {
    throw new UnauthorizedRequestError()
  }

  order.status = OrderStatus.Cancelled
  await order.save();

  // publish an event --> the order was cancelled
  new OrderCancelledPublisher(natsClient.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket?.id
    }
  })

  res.status(204).send(order)
})

export { router as deleteOrderRouter }