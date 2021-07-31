import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'
import { web3 } from '@/helpers/web3'
import { typegooseOptions } from '@/models/index'
import { Chat, ChatModel } from '@/models/Chat'

interface Accounts {
  eth: {
    address: string
    privateKey: string
  }
}

@modelOptions(typegooseOptions)
export class Subscription {
  @prop({ required: true })
  userId: number
  @prop({ required: true })
  chatId: number
  @prop({ required: true, unique: true })
  accounts: Accounts
  @prop({ ref: () => Chat })
  chat: Ref<Chat>
}

export const SubscriptionModel = getModelForClass(Subscription)

export async function getOrCreateSubscription(userId: number, chatId: number) {
  let subscription = await SubscriptionModel.findOne({
    userId,
    chatId,
  }).populate('chat')

  if (subscription) {
    return subscription
  }

  const chat = await ChatModel.findOne({ id: chatId })
  const ethAccount = web3.eth.accounts.create()

  subscription = await SubscriptionModel.create({
    userId,
    chatId,
    accounts: { eth: ethAccount },
    chat,
  })

  return subscription
}
