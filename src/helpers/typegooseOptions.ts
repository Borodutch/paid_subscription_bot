import { Severity } from '@typegoose/typegoose'
import mongoose from 'mongoose'

interface TypegooseOptions {
  existingMongoose?: mongoose.Mongoose
  schemaOptions?: mongoose.SchemaOptions
  existingConnection?: mongoose.Connection
  options?: CustomOptions
}
interface CustomOptions {
  customName?: string
  automaticName?: boolean
  allowMixed?: Severity
  runSyncIndexes?: boolean
}

export const typegooseOptions = {
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
} as TypegooseOptions
