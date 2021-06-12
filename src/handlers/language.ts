import { sendHelp } from '@/handlers/sendHelp'
import { Context, Markup as m } from 'telegraf'
import { readdirSync, readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'

export const localeActions = localesFiles().map((file) => file.split('.')[0])

export function sendLanguage(needsStartAfterwards = false) {
  return (ctx: Context) =>
    ctx.reply(ctx.i18n.t('language'), languageKeyboard(needsStartAfterwards))
}

export async function setLanguage(ctx: Context) {
  let chat = ctx.dbchat
  if ('data' in ctx.callbackQuery) {
    const localeComponents = ctx.callbackQuery.data.split('~')
    const localeCode = localeComponents[1]
    const needsStartAfterwards = localeComponents[2] === 'true'
    chat.language = localeCode
    chat = await chat.save()
    const message = ctx.callbackQuery.message

    ctx.i18n.locale(localeCode)

    await ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      ctx.i18n.t('language_selected'),
      { parse_mode: 'HTML' }
    )
    if (needsStartAfterwards) {
      await sendHelp(ctx)
    }
  }
}

function languageKeyboard(needsStartAfterwards: boolean) {
  const locales = localesFiles()
  const result = []
  locales.forEach((locale, index) => {
    const localeCode = locale.split('.')[0]
    const localeName = safeLoad(
      readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8')
    ).name
    const localeData = `l~${localeCode}~${needsStartAfterwards}`
    if (index % 2 == 0) {
      result.push([m.button.callback(localeName, localeData)])
    } else {
      result[result.length - 1].push(m.button.callback(localeName, localeData))
    }
  })
  return m.inlineKeyboard(result)
}

function localesFiles() {
  return readdirSync(`${__dirname}/../../locales`)
}
