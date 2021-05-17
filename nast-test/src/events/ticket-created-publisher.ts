import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "@supeguitickets/common";
import { Subjects } from "@supeguitickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}