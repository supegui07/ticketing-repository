import request from "supertest";
import { app } from "../../app";

describe('Auth API #component', () => {
  describe('POST /signup', () => {
    test('when valid user, it should returns a 201 and create the user', async () => {
      const responseUserSignup = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
    
      expect(responseUserSignup.status).toBe(201)
    })
    
    test('when invalid email, it should returns 400 badrequest', async () => {
      const responseUserCreated = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'invalid-email',
          password: '12345678'
        })
    
      expect(responseUserCreated.status).toBe(400)
    })

    test('when invalid password, it should returns 400 badrequest', async () => {
      const responseUserCreated = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          password: '123'
        })
    
      expect(responseUserCreated.status).toBe(400)
    })

    test('when user exists, it should returns 404 email in use', async () => {
      const responseUserCreated = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          password: 'password'
        })

      const responseUserExists = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
    
      expect(responseUserCreated.status).toBe(201)
      expect(responseUserExists.status).toBe(404)
    })

    test('when user is created, it should returns 201 and sets the cookie JWT session token', async () => {
      const responseUserCreated = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
      
      expect(responseUserCreated.status).toBe(201)
      expect(responseUserCreated.get('Set-Cookie')).toBeDefined()
    })
  })
})
