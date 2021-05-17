"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // When the order has been created, but the
    // ticket it is trying to order has not been reserved
    OrderStatus["Created"] = "created";
    // The ticket the ordersis trying to reserve has already
    // been reserverd, or when the user cancelled the order,
    // The order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    // The order has successfully reserved the ticket
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    // The user has provided payment successfully
    OrderStatus["Completed"] = "completed";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
