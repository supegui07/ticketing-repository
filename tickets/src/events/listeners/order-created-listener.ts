import { Listener, OrderCreatedEvent, Subjects } from "@supeguitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName:string = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that the order is reserving
    const { id: orderId, ticket: { id : ticketId } } = data

    const ticket = await Ticket.findById(ticketId)

    // if not ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // mark the ticket as being reserved by settings its orderId property
    ticket.set({ orderId })

    // save/update the ticket
    await ticket.save()

    const { id, title, price, version, userId } = ticket
    new TicketUpdatedPublisher(this.client).publish({
     id,
     title,
     price,
     version,
     orderId,
     userId
    })

    // ack the message
    msg.ack()
  }
}