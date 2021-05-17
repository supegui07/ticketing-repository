// An interface that describes the properties
// that a User Model has (A single user) / properties a saved record have
import mongoose from "mongoose";

export interface UserDoc extends mongoose.Document {
  email: string
  password: string
}