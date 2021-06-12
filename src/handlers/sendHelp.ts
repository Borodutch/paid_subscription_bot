import { Context } from 'telegraf'

export function sendHelp(ctx: Context) {
  return ctx.replyWithHTML(ctx.i18n.t('help'), {
    disable_web_page_preview: true,
  })
}
