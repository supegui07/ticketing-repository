import { OrderStatus } from "@supeguitickets/common";

// to create a new order
export interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}