import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { get } from "config";
import mongoose from "mongoose";

// exposing a global function
// it can be either a global function or an exported one from a file
declare global {
  namespace NodeJS {
    interface Global {
      signinHelper(id?: string): string[]
    }
  }
}

jest.mock('../nats-client')

// process.env.STRIkPE_KEY = 'sk_test_51IrOheBnRRyJbzlCYrQH0U5oKryYmhSqD7b1y2uFWmeQnOgHwCXzi9qEwrE1GXgs70BFuZEvg5hCj6JvIEKs66Bd00sHrvRr6s'

let mongo:any

beforeAll(async () => {
  // process.env.JWT_KEY = 'asddsf'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
     
    for (let collection of collections) {
      await collection.deleteMany({})
    }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})


global.signinHelper = (id?: string) => {
  // build a JWT payload. { id, email }
  const payload = {
    id: id || mongoose.Types.ObjectId().toHexString(),
    email: 'tester@test.com'
  }

  // crate the JWT
  const token = jwt.sign(payload, get('jwtConfig.secretKey'))

  // build session object { jwt: MY_JWT
  const session = { jwt: token }

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return the cookie as string
  return [`express:sess=${base64}`]
}
