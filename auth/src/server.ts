
import mongoose from "mongoose";
import { get } from "config";
import { InternalErrorServer } from "@supeguitickets/common";
import { app } from "./app";

const start = async () => {
  if (!get('jwtConfig.secretKey')) {
    throw new InternalErrorServer('Missing the configuration for the env variable JWT_KEY')
  }

  if (!get('mongo.uri')) {
    throw new InternalErrorServer('Missing the configuration for the env variable MONGO_URI')
  }

  try {

    await mongoose.connect(get('mongo.uri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB to the auth db')

  } catch (error) {
    console.error(error)
  }

  app.listen(3001, () => {
    console.log(`Auth service listening on port 3001...`)
  })
}

start()