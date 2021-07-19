import {
  prop,
  getModelForClass,
  Severity,
  modelOptions,
} from '@typegoose/typegoose'
import Web3 from 'web3'
import { Context } from 'telegraf'
import { PriceModel } from '@/models/Price'

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Subscription {
  @prop({ required: true })
  username: string
  @prop({ required: true })
  chatId: number
  @prop({ required: true, unique: true })
  addresses: { ethAddress: string }
  @prop({ required: true, unique: true })
  privateKeys: { ethPrivateKey: string }
}

export const SubscriptionModel = getModelForClass(Subscription)

export async function getOrCreateSubscription(ctx: Context) {
  const subscription = await SubscriptionModel.findOne({
    username: ctx.from.username,
    chatId: ctx.chat.id,
  })

  if (subscription) {
    const price = await PriceModel.findOne({
      username: ctx.from.username,
      chatId: ctx.chat.id,
    }).populate('subscription')
    return ctx.reply(
      `You already have a subscription.\nYour address is:${price.subscription.addresses.ethAddress}\nYour payment is: ${price.amount.ethAmount} ETH.`
    )
  }

  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
  const ethAccount = web3.eth.accounts.create()

  const subscriptionCreated = await SubscriptionModel.create({
    username: ctx.from.username,
    chatId: ctx.chat.id,
    addresses: {
      ethAddress: ethAccount.address,
    },
    privateKeys: {
      ethPrivateKey: ethAccount.privateKey,
    },
  })

  const priceCreated = await PriceModel.create({
    username: ctx.from.username,
    chatId: ctx.chat.id,
    subscription: subscriptionCreated,
    amount: { ethAmount: 1 },
  })

  return ctx.reply(
    `Address of the wallet for your payment is: ${subscriptionCreated.addresses.ethAddress}\nYou will need to pay ${priceCreated.amount.ethAmount} ETH.`
  )
}
