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

const configureAddress = async (
  ctx: Context,
  configuredChannel: DocumentType<Chat>
) => {
  if (!('text' in ctx.message)) {
    return
  }

  const ethAddress = ctx.message.text
  if (!web3.utils.isAddress(ethAddress)) {
    return ctx.reply(ctx.i18n.t('configure_subscription_address_incorrect'))
  }

  configuredChannel.accounts.eth.address = ctx.message.text
  configuredChannel.state = State.awaitingEthPrice

  await configuredChannel.save()

  return ctx.reply(ctx.i18n.t('configure_subscription_price'))
}

const configurePrice = async (
  ctx: Context,
  configuredChannel: DocumentType<Chat>
) => {
  if (!('text' in ctx.message)) {
    return
  }

  const amount = parseFloat(ctx.message.text)
  if (isNaN(amount) || amount < 0) {
    return ctx.reply(ctx.i18n.t('configure_subscription_price_incorrect'))
  }

  configuredChannel.price.monthly.eth = amount

  configuredChannel.state = State.none
  await configuredChannel.save()

  return ctx.replyWithHTML(
    ctx.i18n.t('configure_success', {
      ethAddress: configuredChannel.accounts.eth.address,
      price: configuredChannel.price.monthly.eth,
      botName: ctx.botInfo.username,
      chatId: configuredChannel.id,
    })
  )
}

export const handleConfigureMessage = async (ctx: Context) => {
  const configuredChannel = await ChatModel.findOne({
    id: ctx.dbchat.configuredChatId,
  })

  if (!configuredChannel) {
    return
  }

  switch (configuredChannel.state) {
    case State.awaitingEthAddress:
      return configureAddress(ctx, configuredChannel)
    case State.awaitingEthPrice:
      return configurePrice(ctx, configuredChannel)
    case State.none:
      return
  }
}

export const handleCancel = async (ctx: Context) => {
  const configuredChat = await findChat(ctx.dbchat.configuredChatId)
  if (!configuredChat) {
    return
  }

  configuredChat.state = State.none
  await configuredChat.save()

  ctx.reply(ctx.i18n.t('cancel'))
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
