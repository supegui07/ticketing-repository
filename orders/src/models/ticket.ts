import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketDoc } from "../interfaces/mongo-ticket-document";
import { TicketModel } from "../interfaces/mongo-ticket-model";
import { TicketAttrs } from "../interfaces/mongo-ticket-attrs";
import { Order } from "./order";
import { OrderStatus } from "@supeguitickets/common";

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id

      delete ret._id
      delete ret.__v
    }
  }
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

ticketSchema.statics.build = (attr: TicketAttrs) => {
  const { id, title, price } = attr
  return new Ticket({
    _id: id,
    title,
    price
  })
}

ticketSchema.methods.isReserved = async function() {
  // make sure the ticket is not already reserved
  // run query to find order with the ticket we are tryin to reserve
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed
      ]
    }
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }