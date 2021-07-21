import {
  prop,
  getModelForClass,
  Severity,
  modelOptions,
} from '@typegoose/typegoose'
import Web3 from 'web3'
import { Context } from 'telegraf'
import { PriceModel } from '@/models/Price'

interface Adresses {
  eth: string
}

interface PrivateKeys {
  eth: string
}

interface Prices {
  monthly: { eth: number }
}

@modelOptions({
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
  @prop({ required: true })
  prices: Prices
}

export const SubscriptionModel = getModelForClass(Subscription)

export async function getOrCreateSubscription(userId: number, chatId: number) {
  const subscription = await SubscriptionModel.findOne({
    chatId: chatId,
  })

  const price = 1

  if (subscription) {
    return `To subscribe to this chat, you need to pay ${subscription.prices.monthly.eth} ETH to this adress: ${subscription.addresses.eth}.`
  }

  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
  const ethAccount = web3.eth.accounts.create()

  const subscriptionCreated = await SubscriptionModel.create({
    userId,
    chatId,
    addresses: {
      eth: ethAccount.address,
    },
    privateKeys: {
      eth: ethAccount.privateKey,
    },
    prices: { monthly: { eth: price } },
  })

  return `To subscribe to this chat, you need to pay ${subscriptionCreated.prices.monthly.eth} ETH to this adress: ${subscriptionCreated.addresses.eth}.`
}
