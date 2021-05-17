import { Request, Response, NextFunction } from "express";
import { UnauthorizedRequestError } from "../errors/unauthorized-request-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnauthorizedRequestError
  }

  next()
}