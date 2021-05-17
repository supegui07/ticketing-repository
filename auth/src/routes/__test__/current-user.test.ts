import request from "supertest";
import { app } from "../../app";
import { signinHelper } from "../../test/auth-helper";

describe('Auth API #component', () => {
  describe('GET /currentuser', () => {
    test('when a current user is requested and the accout was created, it should returns a 200 with the signed email', async () => {
      const cookie = await signinHelper()

      const responseCurrentUser = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)

      expect(responseCurrentUser.status).toBe(200)
      expect(responseCurrentUser.body.currentUser?.email).toBe('test@test.com')
    })

    test('when a current user is requested and the account is not signed in, it should returns a 401 Unauthorized request', async () => {
      const responseCurrentUser = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', [])
  
      expect(responseCurrentUser.status).toBe(401)
    })
  })
})
