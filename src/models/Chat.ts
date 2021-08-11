import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { typegooseOptions } from '@/helpers/typegooseOptions'

interface Price {
  monthly: { eth: number }
}

interface Accounts {
  eth: {
    address?: string
    privateKey?: string
  }
}

@modelOptions(typegooseOptions)
export class Chat {
  @prop({ required: true, index: true, unique: true })
  id: number
  @prop()
  language?: string
  @prop()
  notificationsOn: boolean
  @prop()
  administratorIds?: number[]
  @prop()
  price?: Price
  @prop({ sparse: true })
  accounts?: Accounts
  @prop()
  configuredChat?: number
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
      console.log(chat)
    } catch (err) {
      console.log(err)

      chat = await ChatModel.findOne({ id })
    }
  }
  return chat
}
