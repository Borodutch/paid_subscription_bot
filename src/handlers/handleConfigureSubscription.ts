import { Context, Markup as m } from 'telegraf'
import { ChatModel, State } from '@/models/Chat'
import { DocumentType } from '@typegoose/typegoose'
import { Chat, findChat } from '@/models'
import { web3 } from '@/helpers/web3'

export const handleConfigureSubscription = async (ctx: Context) => {
  // detect, how many chats this user manages
  const userChats = await ChatModel.find({
    administratorIds: ctx.chat.id,
  })

  // assuming there are only 0 or 1 chat
  if (userChats.length === 0) {
    return ctx.reply(ctx.i18n.t('configure_no_subscriptions'))
  }

  return sendConfigureSingleSubscription(ctx, userChats[0])
}

export const sendConfigureSingleSubscription = async (
  ctx: Context,
  configuredChat: DocumentType<Chat>
) => {
  const configuredTelegramChat = await ctx.telegram.getChat(configuredChat.id)
  if (!('title' in configuredTelegramChat)) {
    return
  }

  configuredChat.state = State.awaitingEthAddress
  ctx.dbchat.configuredChatId = +configuredChat.id
  await Promise.all([configuredChat.save(), ctx.dbchat.save()])

  return ctx.reply(
    ctx.i18n.t('configure_single_subscription', {
      chatTitle: configuredTelegramChat.title,
      ethAddress:
        configuredChat?.accounts?.eth?.address ||
        ctx.i18n.t('configure_address_undefined'),
      price: configuredChat.price?.monthly?.eth
        ? `${configuredChat.price.monthly.eth} ETH`
        : ctx.i18n.t('configure_price_undefined'),
    })
  )
}
