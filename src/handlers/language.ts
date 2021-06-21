import { Context, Markup as m } from 'telegraf'
import { readdirSync, readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
import { sendNotAdmin } from './sendNotAdmin'
import { sendStartGroup } from './handleMyChatMember'

export const localeActions = localesFiles().map((file) => file.split('.')[0])

type MessageAfterLanguage = 'none' | 'start_group' | 'notAdmin'

export function sendLanguage(
  messageAfterLanguage: MessageAfterLanguage = 'none'
) {
  return (ctx: Context) =>
    ctx.reply(ctx.i18n.t('language'), languageKeyboard(messageAfterLanguage))
}

export async function setLanguage(ctx: Context) {
  let chat = ctx.dbchat
  if ('data' in ctx.callbackQuery) {
    const localeComponents = ctx.callbackQuery.data.split('~')
    const localeCode = localeComponents[1]
    const messageAfterLanguage = localeComponents[2] as MessageAfterLanguage
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
    switch (messageAfterLanguage) {
      case 'start_group':
        await sendStartGroup(ctx)
        break
      case 'notAdmin':
        await sendNotAdmin(ctx)
        break
      default:
        break
    }
  }
}

function languageKeyboard(messageAfterLanguage: MessageAfterLanguage) {
  const locales = localesFiles()
  const result = []
  locales.forEach((locale, index) => {
    const localeCode = locale.split('.')[0]
    const localeName = safeLoad(
      readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8')
    ).name
    const localeData = `l~${localeCode}~${messageAfterLanguage}`
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
