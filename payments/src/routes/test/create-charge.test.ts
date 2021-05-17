import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../model/orders";
import { OrderStatus } from "@supeguitickets/common";
import { stripe } from '../../stripe'
import { Payment } from "../../model/payment";

// jest.mock('../../stripe')

describe('Payments API #component', () => {
  describe('POST /api/payments', () => {
    test('when user tries to pay an order that does not exists, it should return a 404', async() => {
      await request(app)
        .post('/api/payments')
        .set('Cookie', global.signinHelper())
        .send({
          token: 'asdfdsaewewr',
          orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
    })

    test('when user tries to pay an order that does not belong to the user, it should return a 401', async() => {
      const order = Order.build({
        userId: mongoose.Types.ObjectId().toHexString(),
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 20
      })
      await order.save()

      await request(app)
        .post('/api/payments')
        .set('Cookie', global.signinHelper())
        .send({
          token: 'asdfdsaewewr',
          orderId: order.id
        })
        .expect(401)
    })

    test('when user tries to pay a cancelled order, it should return a 400', async() => {
      const userId = mongoose.Types.ObjectId().toHexString()

      const order = Order.build({
        userId: userId,
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        version: 0,
        price: 20
      })
      await order.save()

      await request(app)
        .post('/api/payments')
        .set('Cookie', global.signinHelper(userId))
        .send({
          token: 'asdfdsaewewr',
          orderId: order.id
        })
        .expect(404)
    })

    test('when user pays for the order with valid inputs, it should return a 201 charging the payments', async() => {
      const userId = mongoose.Types.ObjectId().toHexString()
      const price = Math.floor(Math.random() * 100000)
      const order = Order.build({
        userId: userId,
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: price
      })
      await order.save()

      await request(app)
        .post('/api/payments')
        .set('Cookie', global.signinHelper(userId))
        .send({
          token: 'tok_visa',
          orderId: order.id
        })
        .expect(201)

      const stripeCharges = await stripe.charges.list({ limit: 50 })
      const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100
      })

      expect(stripeCharge).toBeDefined()
      expect(stripeCharge!.currency).toEqual('usd')

      const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
      })

      expect(payment).not.toBeNull()
    })


    // test('when user pays for the order with valid inputs, it should return a 201 charging the payments', async() => {
    //   const userId = mongoose.Types.ObjectId().toHexString()

    //   const order = Order.build({
    //     userId: userId,
    //     id: mongoose.Types.ObjectId().toHexString(),
    //     status: OrderStatus.Created,
    //     version: 0,
    //     price: 20
    //   })
    //   await order.save()

    //   await request(app)
    //     .post('/api/payments')
    //     .set('Cookie', global.signinHelper(userId))
    //     .send({
    //       token: 'tok_visa',
    //       orderId: order.id
    //     })
    //     .expect(201)
      
    //   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    //   expect(chargeOptions.source).toEqual('tok_visa')
    //   expect(chargeOptions.amount).toEqual(20 * 100)
    //   expect(chargeOptions.currency).toEqual('usd')
    // })
  })
})