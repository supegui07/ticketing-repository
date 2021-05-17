import { Listener, OrderCancelledEvent, Subjects } from "@supeguitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName: string = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { ticket: { id: ticketId} } = data

    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: undefined })
    await ticket.save()

    const { id, title, price, version, userId, orderId } = ticket
    new TicketUpdatedPublisher(this.client).publish({
      id,
      title,
      price,
      version,
      userId,
      orderId
    })

    msg.ack()
  }
}