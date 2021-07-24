import mongoose from 'mongoose'
import { Severity, setGlobalOptions } from '@typegoose/typegoose'

export function runMongo(mongoUrl = process.env.MONGO) {
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
}

setGlobalOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})

export * from './Chat'
