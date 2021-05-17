import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { get } from "config";
import { UserPayload } from "../interfaces/user-payload";

// adding an optional property to a global interface (Request from express)
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionCookie = req.session?.jwt

  if (!sessionCookie) {
    next()
  }

  try {
    const payload = jwt.verify(sessionCookie, get('jwtConfig.secretKey')) as UserPayload
    req.currentUser = payload
    next()
  } catch (error) { }

  next()
}