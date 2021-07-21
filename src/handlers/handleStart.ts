import { Context } from 'telegraf'
import { MessageAfterLanguage, sendLanguage } from '@/handlers/language'
import { getOrCreateSubscription } from '@/models/Subscription'

export function handleStart(ctx: Context) {
  return sendStart(ctx)
}

export async function sendStart(ctx: Context) {
  const startPayload = ctx.startPayload
  const userId = ctx.from.id
  const chatId = ctx.chat.id

  // if no language detected, ask for language first
  if (!ctx.dbchat.language) {
    sendLanguage(MessageAfterLanguage.start, startPayload)(ctx)
    const subscriptionInfo = await getOrCreateSubscription(userId, chatId)
    return ctx.reply(subscriptionInfo)
  }

  if (!!startPayload && startPayload.startsWith('admin')) {
    const chatId = +startPayload.replace('admin', '')
    const userId = +ctx.from.id
    const chatMemberInfo = await ctx.telegram.getChatMember(chatId, userId)

    const allowedStatuses = ['administrator', 'creator']
    if (allowedStatuses.includes(chatMemberInfo.status)) {
      ctx.reply(ctx.i18n.t('start_group_admin'))
      const subscriptionInfo = await getOrCreateSubscription(userId, chatId)
      return ctx.reply(subscriptionInfo)
    } else {
      return ctx.reply(ctx.i18n.t('start_group_not_admin'))
    }
  }

  const subscriptionInfo = await getOrCreateSubscription(userId, chatId)
  return ctx.reply(subscriptionInfo)
}
