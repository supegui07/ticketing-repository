// the collection of data
import mongoose from "mongoose";
import { PaymentAttrs } from "./mongo-payment-attrs";
import { PaymentDoc } from "./mongo-payment-document";
  
export interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}