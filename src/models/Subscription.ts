import { prop, getModelForClass } from '@typegoose/typegoose'
const Wallet = require('ethereumjs-wallet').default
import { Context } from 'telegraf'

export class Subscription {
  @prop({ required: true })
  username: string
  @prop({ required: true })
  chatId: string
  @prop({ required: true, unique: true })
  adress: string
  @prop({ required: true, unique: true })
  privateKey: string
  @prop({ required: true })
  payment: number
}

export const SubscriptionModel = getModelForClass(Subscription, {
  schemaOptions: { timestamps: true },
})

export async function getOrCreateSubscription(ctx: Context) {
  const subscription = await SubscriptionModel.findOne({
    username: ctx.from.username,
    chatId: ctx.chat.id,
  })

  if (subscription) {
    return ctx.reply(
      `You already have a subscription.\nYour adress is:${subscription.adress}\nYour payment is: ${subscription.payment}`
    )
  }

  const wallet = Wallet.generate()
  const payment = 1

  const subscriptionCreated = await SubscriptionModel.create({
    username: ctx.from.username,
    chatId: ctx.chat.id,
    adress: wallet.getAddressString(),
    privateKey: wallet.getPrivateKeyString(),
    payment,
  })
  return ctx.reply(
    `Adress of the wallet for your payment is: ${subscriptionCreated.adress}\nYou will need to pay ${subscriptionCreated.payment} ETH.`
  )
}
