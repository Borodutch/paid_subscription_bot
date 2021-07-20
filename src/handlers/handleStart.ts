import { Context } from 'telegraf'
import { MessageAfterLanguage, sendLanguage } from '@/handlers/language'
import { handleConfigureSubscriptions } from '@/handlers/handleConfigureSubscriptions'
import { findChat } from '@/models'

export function handleStart(ctx: Context) {
  return sendStart(ctx)
}

export async function sendStart(ctx: Context) {
  const startPayload = ctx.startPayload

  // if no language detected, ask for language first
  if (!ctx.dbchat.language) {
    return sendLanguage(MessageAfterLanguage.start, startPayload)(ctx)
  }

  if (!!startPayload && startPayload.startsWith('admin')) {
    // check whether user is admin or not
    const chatId = +startPayload.replace('admin', '')
    const userId = +ctx.from.id
    const chatMemberInfo = await ctx.telegram.getChatMember(chatId, userId)

    // if status not allowed, send back a denial
    const allowedStatuses = ['administrator', 'creator']
    if (!allowedStatuses.includes(chatMemberInfo.status)) {
      return ctx.reply(ctx.i18n.t('start_group_not_admin'))
    }

    // save user as chat admin in array
    const chat = await findChat(chatId)
    chat.administratorIds = chat.administratorIds || []
    if (!chat.administratorIds.includes(userId)) {
      chat.administratorIds.push(userId)
    }
    await chat.save()

    return handleConfigureSubscriptions(ctx)
  }

  return ctx.replyWithHTML(ctx.i18n.t('help'))
}
