import { Severity } from '@typegoose/typegoose'
import { IModelOptions } from '@typegoose/typegoose/lib/types'

export const typegooseOptions = {
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
} as IModelOptions
