import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session"

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@supeguitickets/common";

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

// routes
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// handling all routes not found or not defined
app.all('*', async () => {
  throw new NotFoundError()
})

// midleware
app.use(errorHandler)

export { app }

