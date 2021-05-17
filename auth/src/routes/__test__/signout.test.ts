import request from "supertest";
import { app } from "../../app";

describe('Auth API #component', () => {
  describe('GET /signout', () => {
    test('when valid account was signed in and the user sign out, it should returns a 200', async () => {
      const responseUserCreated = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          password: 'password'
        })

      const responseUserSignedIn = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
  
      const responseUserSignout = await request(app)
        .get('/api/users/signout')

      expect(responseUserCreated.status).toBe(201)
      expect(responseUserSignedIn.status).toBe(200)
      expect(responseUserSignedIn.get('Set-Cookie')).toBeDefined()
      expect(responseUserSignout.status).toBe(200)
      expect(responseUserSignout.get('Set-Cookie')[0]).toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')

    })
  })
})
