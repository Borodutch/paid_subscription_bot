import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { typegooseOptions } from '@/helpers/typegooseOptions'

interface Price {
  monthly: { eth: number }
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
  price?: Price
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
