import mongoose, { Schema } from "mongoose";
import { PaymentAttrs } from "../interfaces/mongo-payment-attrs";
import { PaymentDoc } from "../interfaces/mongo-payment-document";
import { PaymentModel } from "../interfaces/mongo-payment-model";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  })
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }