import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'
import { web3 } from '@/helpers/web3'
import { typegooseOptions } from '@/helpers/typegooseOptions'
import { Chat, findChat } from '@/models/Chat'
import { Accounts } from '@/models/Accounts'

@modelOptions(typegooseOptions)
export class Subscription {
  @prop({ required: true, index: true })
  userId: number
  @prop({ required: true, index: true })
  chatId: number
  @prop({ required: true, unique: true })
  accounts: Accounts
  @prop({ ref: () => Chat, index: true })
  chat: Ref<Chat>
}

export const SubscriptionModel = getModelForClass(Subscription)

export function getUserSubscriptions(userId: number) {
  return SubscriptionModel.find({ userId }).populate('chat')
}

export async function getOrCreateSubscription(userId: number, chatId: number) {
  let subscription = await SubscriptionModel.findOne({
    userId,
    chatId,
  }).populate('chat')

  if (subscription) {
    return subscription
  }

  const chat = await findChat(chatId)
  const ethAccount = web3.eth.accounts.create()

  subscription = await SubscriptionModel.create({
    userId,
    chatId,
    accounts: { eth: ethAccount },
    chat,
  })

  return subscription
}
