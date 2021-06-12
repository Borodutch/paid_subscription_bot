import { Context } from 'telegraf'

export function sendSetupLink(ctx: Context) {
  return ctx.replyWithHTML(ctx.i18n.t('setupLink'))
}
