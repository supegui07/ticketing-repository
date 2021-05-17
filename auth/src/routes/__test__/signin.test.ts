import request from "supertest";
import { app } from "../../app";

describe('Auth API #component', () => {
  describe('POST /signin', () => {
    test('when valid user and password, it should returns a 201 user signed in and response with a cookie session', async () => {
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
  
      expect(responseUserCreated.status).toBe(201)
      expect(responseUserSignedIn.status).toBe(200)
      expect(responseUserSignedIn.get('Set-Cookie')).toBeDefined()
    })

    test('when account do not exists, it should returns a 404 invalid credentials', async () => {
      const responseUserSignedIn = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'invalid-email@invalid.com',
          password: 'password'
        })
    
      expect(responseUserSignedIn.status).toBe(404)
    })

    test('when passwords do not match, it should returns a 404 invalid credentials', async () => {
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
          password: 'invalid-password'
        })
    
      expect(responseUserCreated.status).toBe(201)
      expect(responseUserSignedIn.status).toBe(404)
    })
  })
})
