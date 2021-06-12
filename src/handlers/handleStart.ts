import { Context } from 'telegraf'

export function handleStart(ctx: Context) {
  return ctx.replyWithHTML(ctx.i18n.t('help'))
}
