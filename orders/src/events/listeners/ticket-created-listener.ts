import { Listener, TicketCreatedEvent, Subjects } from "@supeguitickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated

  // queue group handle the subscriptions, when a message arrives it ensure
  // the message is delivery only to one of the subscribers (in the case
  // there're many instances/pods of the services listening
  queueGroupName: string = queueGroupName

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data
    const ticket = Ticket.build({
      id,
      title,
      price,
      version
    })
    
    await ticket.save()

    msg.ack()
  }
}