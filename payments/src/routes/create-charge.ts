import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, BadRequestError, NotFoundError, UnauthorizedRequestError, OrderStatus } from "@supeguitickets/common";
import { Order } from "../model/orders";
import { stripe } from "../stripe";
import { Payment } from "../model/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsClient } from "../nats-client";


const router = express.Router()

router.post('/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
        .withMessage('Token must be provided'),
    body('orderId')
      .not()
      .isEmpty()
        .withMessage('OrderId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError()
    }

    if(order.userId !== req.currentUser!.id) {
      throw new UnauthorizedRequestError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order')
    }

    const stripeCharge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
      description: `Paying for order`
    })

    const payment = Payment.build({
      orderId,
      stripeId: stripeCharge.id
    })
    await payment.save()

    new PaymentCreatedPublisher(natsClient.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: stripeCharge.id
    })

    res.status(201).send({ payment })
})

export { router as createChargeRouter }