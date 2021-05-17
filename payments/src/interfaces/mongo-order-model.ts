  // the collection of data
import mongoose from "mongoose";
import { OrderDoc } from "./mongo-order-document";
import { OrderAttrs } from "./mongo-order-attrs";

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}