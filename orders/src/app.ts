import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@supeguitickets/common";
import { getOrdersRouter } from "./routes/get-orders";
import { deleteOrderRouter } from "./routes/delete-order";
import { createOrderRouter } from "./routes/create-order";
import { getOrderByIdRouter } from "./routes/get-by-id";

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

// routes
app.use(getOrdersRouter)
app.use(deleteOrderRouter)
app.use(getOrderByIdRouter)
app.use(createOrderRouter)


// handling all routes not found or not defined
app.all('*', async() => {
  return new NotFoundError()
})

// error handling middleware
app.use(errorHandler)

export { app }