import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { typegooseOptions } from '@/helpers/typegooseOptions'

interface Price {
  monthly: { eth: number }
}

// state of private chat for configuration of public paid chats
export enum ConfigurationState {
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
  @prop()
  administratorIds?: number[]
  @prop()
  price?: Price
  @prop()
  ethAddress?: string
  @prop()
  configuredChat?: number
  @prop({ default: ConfigurationState.none })
  configurationState?: ConfigurationState
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
