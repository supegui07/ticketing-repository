import { Publisher, ExpirationCompletedEvent, Subjects } from "@supeguitickets/common";


export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted
}