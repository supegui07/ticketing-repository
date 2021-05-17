import express, { Request, Response} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { get } from "config";

import { User } from "../model/user";
import { BadRequestError, validateRequest } from "@supeguitickets/common";


const router = express.Router()

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20})
    .withMessage('Password must be between 4 and 20 characters')
],
validateRequest,
async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new BadRequestError('Email in use')
  }

  const user = User.build({ email, password })
  await user.save()

  // Generate JWT
  const userJWT = jwt.sign({
    id: user.id,
    email: user.email
  },
    get('jwtConfig.secretKey')
  )

  // Store JWS on session object cookie
  req.session = { 
    jwt: userJWT
  }

  res.status(201).send(user)
})

export { router as signupRouter }
