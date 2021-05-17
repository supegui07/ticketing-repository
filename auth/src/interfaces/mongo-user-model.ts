// An interface that describes the properties
// that a User Model has / the collection of data
import mongoose from "mongoose";
import { UserAttrs } from "./mongo-user-attrs";
import { UserDoc } from "./mongo-user-document";

export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc 
}