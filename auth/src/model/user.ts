import mongoose from "mongoose";
import { UserAttrs } from "../interfaces/mongo-user-attrs";
import { UserModel } from "../interfaces/mongo-user-model";
import { UserDoc } from "../interfaces/mongo-user-document";
import { Password } from "../services/password";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id

      delete ret._id
      delete ret.password
      delete ret.__v
    }
  }
})


userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHas(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

// Adding custom methods to the model
// and be able to validate the inconming object to be UserAttrs
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// The < , > means generics in typescript
// they are customazed types for the function
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }