import mongoose, { Schema } from "mongoose";
import { OrderDoc } from "../interfaces/mongo-order-document";
import { OrderModel } from "../interfaces/mongo-order-model";
import { OrderAttrs } from "../interfaces/mongo-order-attrs";
import { OrderStatus } from "@supeguitickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id

      delete ret._id
      delete ret.__v
    }
  }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attr: OrderAttrs) => {
  return new Order(attr)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }