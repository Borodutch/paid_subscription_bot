import { Context } from 'telegraf'

export function toggleNotifications(ctx: Context) {
  ctx.dbchat.notificationsOn = !ctx.dbchat.notificationsOn
  return ctx.dbchat.save()
}
