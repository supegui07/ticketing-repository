import request from "supertest";
import { app } from "../app";

export const signinHelper = async() => {
  const email = 'test@test.com'
  const password = 'password'

  const responseUserCreated = await request(app)
    .post('/api/users/signup')
    .send({ email, password })

  const cookie = responseUserCreated.get('Set-Cookie')

  expect(responseUserCreated.status).toBe(201)
  expect(responseUserCreated.get('Set-Cookie')).toBeDefined()

  return cookie
}