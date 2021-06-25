import { Context } from 'telegraf'

export function handleStart(ctx: Context) {
  return sendStart(ctx)
}

export async function sendStart(ctx: Context) {
  const startPayload = ctx.startPayload
  console.log(startPayload)

  if (!!startPayload && startPayload.startsWith('admin')) {
    const chatId = +startPayload.replace('admin', '')
    const userId = +ctx.message.from.id
    const chatMemberInfo = await ctx.telegram.getChatMember(chatId, userId)

    console.log(chatId)
    console.log(userId)
    console.log(chatMemberInfo)

    const chatMemberStatus = chatMemberInfo.status
    const allowedStatuses = ['administrator', 'creator']
    if (allowedStatuses.includes(chatMemberStatus)) {
      console.log('user allowed!')
      return ctx.reply(ctx.i18n.t('start_group_admin'))
    } else {
      console.log('user not allowed!')
      return ctx.reply(ctx.i18n.t('start_group_not_admin'))
    }
  }
  console.log('basic start')

  return ctx.replyWithHTML(ctx.i18n.t('help'))
}
