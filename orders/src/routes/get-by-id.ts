import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, UnauthorizedRequestError } from "@supeguitickets/common";
import { Order } from "../models/order";

const router = express.Router()

router.get('/api/orders/:id',
requireAuth,
async (req: Request, res: Response) => {
  const orderId = req.params.id

  const order = await Order.findById(orderId).populate('ticket')

  if (!order) {
    throw new NotFoundError()
  }

  if(order.userId !== req.currentUser!.id) {
    throw new UnauthorizedRequestError()
  }

  res.send(order)
})

export { router as getOrderByIdRouter }