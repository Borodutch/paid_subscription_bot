import { Context } from 'telegraf'
import { ChatModel } from '@/models/Chat'

export const sendConfigureSubscriptions = (ctx: Context) => {
  return ctx.reply(
    ctx.i18n.t('configure_subscriptions', {
      channelsData: '\n\n example',
    })
  )
}

export const sendConfigureSingleSubscription = (ctx: Context) => {
  return ctx.reply(
    ctx.i18n.t('configure_single_subscription', {
      chatId: ctx.userChats[0].id,
    })
  )
}

export const handleConfigureSubscriptions = async (ctx: Context) => {
  // detect, how many chats this user manages
  ctx.userChats = await ChatModel.find({
    administratorIds: ctx.chat.id,
  })

  console.log(ctx.userChats)
  if (ctx.userChats.length === 0) {
    return ctx.reply(ctx.i18n.t('configure_no_subscriptions'))
  }

  if (ctx.userChats.length === 1) {
    return sendConfigureSingleSubscription(ctx)
  }

  return sendConfigureSubscriptions(ctx)
}
