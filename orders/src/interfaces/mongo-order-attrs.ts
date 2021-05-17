import { OrderStatus } from "@supeguitickets/common";
import { TicketDoc } from "./mongo-ticket-document";

// to create a new order
export interface OrderAttrs {
  userId: string,
  status: OrderStatus,
  expiresAt: Date,
  ticket: TicketDoc
}