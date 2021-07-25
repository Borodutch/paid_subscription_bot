import mongoose from 'mongoose'
import { Severity } from '@typegoose/typegoose'

export const typegooseOptions = {
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
}

export function runMongo(mongoUrl = process.env.MONGO) {
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
}

export * from './Chat'
