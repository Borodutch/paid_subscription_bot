import { Context } from 'telegraf'
import { MessageAfterLanguage, sendLanguage } from '@/handlers/language'
import { getOrCreateSubscription } from '@/models/Subscription'

export function handleStart(ctx: Context) {
  return sendStart(ctx)
}

export async function sendStart(ctx: Context) {
  const startPayload = ctx.startPayload

  // if no language detected, ask for language first
  if (!ctx.dbchat.language) {
    return sendLanguage(MessageAfterLanguage.start, startPayload)(ctx)
  }

  if (!startPayload) {
    return ctx.replyWithHTML(ctx.i18n.t('help'))
  }

  if (startPayload.startsWith('admin')) {
    const chatId = +startPayload.replace('admin', '')
    const userId = ctx.from.id
    const chatMemberInfo = await ctx.telegram.getChatMember(chatId, userId)

    const allowedStatuses = ['administrator', 'creator']
    if (allowedStatuses.includes(chatMemberInfo.status)) {
      return ctx.replyWithHTML(
        ctx.i18n.t('start_group_admin', {
          chatId,
          botName: ctx.botInfo.username,
        })
      )
    } else {
      return ctx.reply(ctx.i18n.t('start_group_not_admin'))
    }
  }

  const subscription = await getOrCreateSubscription(ctx.from.id, +startPayload)

  if (!subscription.chat.price) {
    return ctx.reply(ctx.i18n.t('subscription_message_no_price'))
  }

  return ctx.reply(
    ctx.i18n.t('subscription_message', {
      subscriptionAddress: subscription.accounts.eth.address,
      subscriptionPrice: subscription.chat.price.monthly.eth,
    })
  )
}
