import { Context, Markup as m } from 'telegraf'
import { ChatModel } from '@/models/Chat'
import { CommonMessageBundle } from 'telegraf/typings/core/types/typegram'

export const sendConfigureSubscriptions = async (ctx: Context) => {
  // make keyboard
  const chatData = await Promise.all(
    ctx.userChats.map((userChat) => ctx.telegram.getChat(userChat.id))
  )

  const keyboardData = []
  chatData.forEach((chat) => {
    keyboardData.push([m.button.callback(chat.title, `conf~${chat.id}`)])
  })
  const keyboard = m.inlineKeyboard(keyboardData)

  // send message
  return ctx.reply(ctx.i18n.t('configure_subscriptions'), keyboard)
}

export const sendConfigureSingleSubscription = (ctx: Context) => {
  const chat = ctx.userChats[0]

  // make a keyboard
  const keyboard = m.inlineKeyboard([
    m.button.callback(
      ctx.i18n.t('configure_wallet_button'),
      `wallet~${chat.id}`
    ),
    m.button.callback(ctx.i18n.t('configure_pay_button'), `pay~${chat.id}`),
  ])

  return ctx.reply(
    ctx.i18n.t('configure_single_subscription', {
      chatId: chat.id,
      ethWallet: chat.ethWallet || ctx.i18n.t('configure_wallet_undefined'),
      payment: chat.payment || '0.00',
    }),
    keyboard
  )
}

export const handleConfWallet = async (ctx: Context) => {
  if (!('data' in ctx.callbackQuery)) {
    return
  }
  const chatId = +ctx.callbackQuery.data.split('~')[1]
  const msg = await ctx.reply(ctx.i18n.t('configure_wallet'))

  ctx.dbchat.configuredChat = chatId
  ctx.dbchat.walletConfMessageId = msg.message_id
  await ctx.dbchat.save()
}

export const handleConfPay = async (ctx: Context) => {
  if (!('data' in ctx.callbackQuery)) {
    return
  }
  const chatId = +ctx.callbackQuery.data.split('~')[1]
  const msg = await ctx.reply(ctx.i18n.t('configure_pay'))

  ctx.dbchat.configuredChat = chatId
  ctx.dbchat.paymentConfMessageId = msg.message_id
  await ctx.dbchat.save()
}

export const handleConfMessage = async (ctx: Context) => {
  const msg = ctx.message
  const replyTo = msg.reply_to_message
  if (!replyTo) return

  // configuring wallet
  if (ctx.dbchat.walletConfMessageId === replyTo.message_id) {
    const configuredChannel = await ChatModel.findOne({
      id: ctx.dbchat.configuredChat,
    })
    if (!configuredChannel) return

    configuredChannel.ethWallet = msg.text
    await configuredChannel.save()

    return ctx.reply(ctx.i18n.t('configure_wallet_success'))
  }

  // configuring payment
  if (ctx.dbchat.paymentConfMessageId === replyTo.message_id) {
    const configuredChannel = await ChatModel.findOne({
      id: ctx.dbchat.configuredChat,
    })
    if (!configuredChannel) return

    const amount = Math.floor(+msg.text * 100) / 100
    if (isNaN(amount)) return

    configuredChannel.payment = amount
    await configuredChannel.save()

    return ctx.reply(ctx.i18n.t('configure_pay_success'))
  }
}

export const handleConfigureSubscriptions = async (ctx: Context) => {
  // detect, how many chats this user manages
  ctx.userChats = await ChatModel.find({
    administratorIds: ctx.chat.id,
  })

  if (ctx.userChats.length === 0) {
    return ctx.reply(ctx.i18n.t('configure_no_subscriptions'))
  }

  if (ctx.userChats.length === 1) {
    return sendConfigureSingleSubscription(ctx)
  }

  return sendConfigureSubscriptions(ctx)
}
