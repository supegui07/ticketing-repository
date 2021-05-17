// a saved record
import mongoose from "mongoose";
import { OrderStatus } from "@supeguitickets/common";

export interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}