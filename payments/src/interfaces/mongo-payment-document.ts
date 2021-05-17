// a saved record
import mongoose from "mongoose";

export interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}