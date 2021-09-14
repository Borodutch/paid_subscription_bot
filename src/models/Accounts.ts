import { prop } from '@typegoose/typegoose'

class Eth {
  @prop()
  address: string
  @prop()
  privateKey: string
}

export class Accounts {
  @prop()
  eth: Eth
}
