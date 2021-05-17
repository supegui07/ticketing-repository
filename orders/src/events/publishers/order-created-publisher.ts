import { Publisher, OrderCreatedEvent, Subjects } from "@supeguitickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}