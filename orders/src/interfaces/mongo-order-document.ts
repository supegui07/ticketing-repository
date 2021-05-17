// a saved record
import mongoose from "mongoose";
import { TicketDoc } from "./mongo-ticket-document";
import { OrderStatus } from "@supeguitickets/common";

export interface OrderDoc extends mongoose.Document {
  userId: string,
  version: number,
  status: OrderStatus,
  expiresAt: Date,
  ticket: TicketDoc
}