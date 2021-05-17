import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@supeguitickets/common";
import { createChargeRouter } from "./routes/create-charge";

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

// routes
app.use(createChargeRouter)

// handling all routes not found or not defined
app.all('*', async() => {
  return new NotFoundError()
})

// error handling middleware
app.use(errorHandler)

export { app }