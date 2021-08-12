import { Context, Markup as m } from 'telegraf'
import { ChatModel } from '@/models/Chat'
import { DocumentType } from '@typegoose/typegoose'
import { Chat } from '@/models'

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

export const handleConfigureMessage = async (ctx: Context) => {
  if (!('reply_to_message' in ctx.message) || !('text' in ctx.message)) {
    return
  }
  const message = ctx.message
  const replyTo = message.reply_to_message
  if (!replyTo) return

  // configuring wallet
  if (ctx.dbchat.walletConfigureMessageId === replyTo.message_id) {
    const configuredChannel = await ChatModel.findOne({
      id: ctx.dbchat.configuredChat,
    })
    if (!configuredChannel) return

    configuredChannel.accounts = configuredChannel.accounts || {}
    configuredChannel.ethAddress = message.text
    console.log(configuredChannel)

    await configuredChannel.save()

    return ctx.reply(ctx.i18n.t('configure_wallet_success'))
  }

  // configuring payment
  if (ctx.dbchat.paymentConfigureMessageId === replyTo.message_id) {
    const configuredChannel = await ChatModel.findOne({
      id: ctx.dbchat.configuredChat,
    })
    if (!configuredChannel) return

    const amount = Math.floor(+message.text * 100) / 100
    if (isNaN(amount)) return

    configuredChannel.price = {
      monthly: { eth: amount },
    }
    await configuredChannel.save()

    return ctx.reply(ctx.i18n.t('configure_pay_success'))
  }
}

export const sendConfigureSingleSubscription = async (
  ctx: Context,
  configuredChat: DocumentType<Chat>
) => {
  // fetch chat name
  const configuredTelegramChat = await ctx.telegram.getChat(configuredChat.id)
  if (!('title' in configuredTelegramChat)) return

  return ctx.reply(
    ctx.i18n.t('configure_single_subscription', {
      chatTitle: configuredTelegramChat.title,
      ethAddress: configuredChat.ethAddress,
      payment: configuredChat.price.monthly.eth,
    })
  )
}
