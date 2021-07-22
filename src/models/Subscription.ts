import {
  prop,
  getModelForClass,
  Severity,
  setGlobalOptions,
} from '@typegoose/typegoose'
import Web3 from 'web3'

interface Adresses {
  eth: string
}

interface PrivateKeys {
  eth: string
}

interface Prices {
  monthly: { eth: number }
}

setGlobalOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})

export class Subscription {
  @prop({ required: true })
  userId: number
  @prop({ required: true })
  chatId: number
  @prop({ required: true, unique: true })
  addresses: Adresses
  @prop({ required: true, unique: true })
  privateKeys: PrivateKeys
  @prop({})
  prices: Prices
}

export const SubscriptionModel = getModelForClass(Subscription)

export async function getOrCreateSubscription(userId: number, chatId: number) {
  let subscription = await SubscriptionModel.findOne({
    chatId,
  })

  if (subscription) {
    return subscription
  }

  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
  const ethAccount = web3.eth.accounts.create()

  subscription = await SubscriptionModel.create({
    userId,
    chatId,
    addresses: {
      eth: ethAccount.address,
    },
    privateKeys: {
      eth: ethAccount.privateKey,
    },
  })

  return subscription
}
