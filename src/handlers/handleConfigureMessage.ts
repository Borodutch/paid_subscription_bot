import { web3 } from '@/helpers/web3'
import { Chat, State, ChatModel } from '@/models'
import { DocumentType } from '@typegoose/typegoose'
import { Context } from 'telegraf'

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

  configuredChannel.accounts = { eth: { address: ctx.message.text } }
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

  configuredChannel.price = { monthly: { eth: amount } }

  configuredChannel.state = State.none
  await configuredChannel.save()

  return ctx.reply(
    ctx.i18n.t('configure_success', {
      ethAddress: configuredChannel.accounts.eth.address,
      price: configuredChannel.price.monthly.eth,
      botName: ctx.botInfo.username,
      chatId: configuredChannel.id,
    }),
    { parse_mode: 'Markdown' }
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
