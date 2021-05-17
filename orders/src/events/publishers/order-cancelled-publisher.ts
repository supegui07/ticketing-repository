import { Publisher, OrderCancelledEvent, Subjects } from "@supeguitickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}