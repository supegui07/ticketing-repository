import { Publisher, PaymentCreatedEvent, Subjects } from "@supeguitickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}