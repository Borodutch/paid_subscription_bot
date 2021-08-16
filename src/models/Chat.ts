import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { typegooseOptions } from '@/helpers/typegooseOptions'
import { Accounts } from '@/models/Accounts'

interface Price {
  monthly: { eth: number }
}

export enum State {
  none = 'none',
  awaitingEthAddress = 'awaitingEthAddress',
  awaitingEthPrice = 'awaitingEthPrice',
}

@modelOptions(typegooseOptions)
export class Chat {
  @prop({ required: true, index: true, unique: true })
  id: number
  @prop()
  language?: string
  @prop()
  notificationsOn: boolean
  @prop({ required: true, default: [] })
  administratorIds?: number[]
  @prop()
  price?: Price
  @prop()
  accounts?: Accounts
  @prop()
  configuredChatId?: number
  @prop({ enum: State })
  state?: State
  @prop()
  walletConfigureMessageId?: number
  @prop()
  paymentConfigureMessageId?: number
}

// Get Chat model
export const ChatModel = getModelForClass(Chat)

// Get or create chat
export async function findChat(id: number) {
  let chat = await ChatModel.findOne({ id })

  if (!chat) {
    // Try/catch is used to avoid race conditions
    try {
      chat = await new ChatModel({ id }).save()
    } catch (err) {
      chat = await ChatModel.findOne({ id })
    }
  }
  return chat
}
