import { Context, Markup as m } from 'telegraf'
import { ChatModel, ConfigurationState } from '@/models/Chat'
import { DocumentType } from '@typegoose/typegoose'
import { Chat } from '@/models'
import { web3 } from '../helpers/web3'

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
  if (!('text' in ctx.message)) return

  const message = ctx.message

  const configuredChannel = await ChatModel.findOne({
    id: ctx.dbchat.configuredChat,
  })
  if (!configuredChannel) return

  // if nothing to configure
  if (configuredChannel.configurationState === ConfigurationState.none) return

  // configuring wallet
  if (
    configuredChannel.configurationState ===
    ConfigurationState.awaitingEthAddress
  ) {
    const ethAddress = message.text
    if (!web3.utils.isAddress(ethAddress)) {
      return ctx.reply(ctx.i18n.t('configure_subscription_address_incorrect'))
    }

    configuredChannel.ethAddress = message.text
    configuredChannel.configurationState = ConfigurationState.awaitingEthPrice

    await configuredChannel.save()

    return ctx.reply(ctx.i18n.t('configure_subscription_price'))
  }

  // configuring price
  if (
    configuredChannel.configurationState === ConfigurationState.awaitingEthPrice
  ) {
    const amount = parseFloat(message.text)
    if (isNaN(amount)) {
      return ctx.reply(ctx.i18n.t('configure_subscription_price_incorrect'))
    }

    configuredChannel.price = configuredChannel.price || {}
    configuredChannel.price.monthly = configuredChannel.price.monthly || {}
    configuredChannel.price.monthly.eth = amount

    configuredChannel.configurationState = ConfigurationState.none
    await configuredChannel.save()

    return ctx.replyWithHTML(
      ctx.i18n.t('configure_success', {
        ethAddress: configuredChannel.ethAddress,
        price: configuredChannel.price.monthly.eth,
        botName: ctx.botInfo.username,
        chatId: configuredChannel.id,
      })
    )
  }
}

export const sendConfigureSingleSubscription = async (
  ctx: Context,
  configuredChat: DocumentType<Chat>
) => {
  // fetch chat name
  const configuredTelegramChat = await ctx.telegram.getChat(configuredChat.id)
  if (!('title' in configuredTelegramChat)) return

  configuredChat.configurationState = ConfigurationState.awaitingEthAddress
  ctx.dbchat.configuredChat = +configuredChat.id
  await Promise.all([configuredChat.save(), ctx.dbchat.save()])

  return ctx.reply(
    ctx.i18n.t('configure_single_subscription', {
      chatTitle: configuredTelegramChat.title,
      ethAddress:
        configuredChat.ethAddress || ctx.i18n.t('configure_address_undefined'),
      price: configuredChat.price?.monthly?.eth
        ? `${configuredChat.price.monthly.eth} ETH`
        : ctx.i18n.t('configure_price_undefined'),
    })
  )
}
