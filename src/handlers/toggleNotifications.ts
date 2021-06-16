import { Context } from 'telegraf'

export async function toggleNotifications(ctx: Context) {
  ctx.dbchat.notificationsOn = !ctx.dbchat.notificationsOn
  await ctx.dbchat.save()
  const replyType = ctx.dbchat.notificationsOn
    ? 'notifications_on'
    : 'notifications_off'
  return ctx.reply(ctx.i18n.t(replyType), {
    reply_to_message_id: ctx.message.message_id,
  })
}
