import { Severity } from '@typegoose/typegoose'

export const typegooseOptions = {
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
}
