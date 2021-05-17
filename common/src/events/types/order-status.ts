export enum OrderStatus {
  // When the order has been created, but the
  // ticket it is trying to order has not been reserved
  Created = 'created',

  // The ticket the ordersis trying to reserve has already
  // been reserverd, or when the user cancelled the order,
  // The order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // The user has provided payment successfully
  Completed = 'completed'
}