import { Publisher, Subjects, TicketCreatedEvent } from '@supeguitickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}