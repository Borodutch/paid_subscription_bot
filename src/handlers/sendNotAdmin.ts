import { Context } from 'telegraf'

export function sendNotAdmin(ctx: Context) {
  return ctx.replyWithHTML(ctx.i18n.t('not_admin'))
}
