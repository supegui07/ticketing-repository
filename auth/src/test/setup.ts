import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// exposing a global function
// it can be either a global function or an exported one from a file
// global.signin = async() => {...}
declare global {
  namespace NodeJS {
    interface Global {
      signinHelper(): Promise<string[]>
    }
  }
}


let mongo:any

beforeAll(async () => {
  process.env.JWT_
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