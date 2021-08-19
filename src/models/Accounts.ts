import { prop } from '@typegoose/typegoose'

export class Accounts {
  @prop()
  eth: {
    address: string
    privateKey: string
  }
}
