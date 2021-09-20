import { prop } from '@typegoose/typegoose'

class Eth {
  @prop()
  address: string
  @prop()
  privateKey: string
}

export class Accounts {
  @prop({ _id: false })
  eth: Eth
}
