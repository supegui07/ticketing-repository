  // the collection of data
  import mongoose from "mongoose";
  import { TicketDoc } from "./mongo-ticket-document";
  import { TicketAttrs } from "./mongo-ticket-attrs";
  
  export interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id:string, version: number } ): Promise<TicketDoc | null>;
  }