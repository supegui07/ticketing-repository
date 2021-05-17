import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { get } from "config";

import { User } from "../model/user";
import { BadRequestError, validateRequest } from "@supeguitickets/common";
import { Password } from "../services/password";

const router = express.Router()

router.post('/api/users/signin', [
  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
],
validateRequest,
async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordMatch = await Password.compare(existingUser.password, password)

  if (!passwordMatch) {
    throw new BadRequestError('Invalid credentials');
  }

  // Generate JWT
  const userJWT = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, 
    get('jwtConfig.secretKey')
  )

  req.session = {
    jwt: userJWT
  }

  res.json({ user: existingUser })
})

export { router as signinRouter }
