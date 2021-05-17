import express, { Response, Request } from "express";
import { NotFoundError } from "@supeguitickets/common";
import { Ticket } from "../model/ticket";

const router = express.Router()

router.get('/api/tickets/:id',
async (req: Request, res: Response) => {
  const ticketId = req.params!.id
  const ticket = await Ticket.findById(ticketId)
  
  if (!ticket) {
    throw new NotFoundError()
  }

  res.send(ticket)
})

export { router as  getTicketByIdRouter}