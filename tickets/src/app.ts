import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { getTicketsRouter } from "./routes/get-tickets";
import { createTicketRouter } from "./routes/create-ticket";
import { getTicketByIdRouter } from './routes/get-ticket-by-id'
import { NotFoundError, errorHandler, currentUser } from "@supeguitickets/common";
import { UpdateTicketRouter } from "./routes/update-ticket";

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

// routes
app.use(createTicketRouter)
app.use(UpdateTicketRouter)
app.use(getTicketsRouter)
app.use(getTicketByIdRouter)

// handling all routes not found or not defined
app.all('*', async() => {
  return new NotFoundError()
})

// error handling middleware
app.use(errorHandler)

export { app }