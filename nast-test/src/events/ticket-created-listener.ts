import { Message } from 'node-nats-streaming';
import { Listener } from '../../../common/src/events/base/base-listener';
import { TicketCreatedEvent } from '@supeguitickets/common';
import { Subjects } from '@supeguitickets/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payment-services';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('event data', data);

    msg.ack();
  }
}
