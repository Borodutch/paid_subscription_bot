import { Context, Markup as m } from 'telegraf'
import { readdirSync, readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
import { sendNotAdmin } from './sendNotAdmin'
import { sendStartGroup } from './handleMyChatMember'
import { sendStart } from '@/handlers/handleStart';

export const localeActions = localesFiles().map((file) => file.split('.')[0])

export enum MessageAfterLanguage {
  none = 'n',
  start = 's',
  startGroup = 'sg',
  startAdmin = 'sa',
  notAdmin = 'na',
}

export function sendLanguage(
  messageAfterLanguage: MessageAfterLanguage = MessageAfterLanguage.none, additionalParams?: string
) {
  return (ctx: Context) =>
    ctx.reply(ctx.i18n.t('language'), languageKeyboard(messageAfterLanguage, additionalParams))
}

export async function setLanguage(ctx: Context) {
  let chat = ctx.dbchat
  if ('data' in ctx.callbackQuery) {
    const localeComponents = ctx.callbackQuery.data.split('~')
    const localeCode = localeComponents[1]
    const messageAfterLanguage = localeComponents[2] as MessageAfterLanguage
    const additionalParams = localeComponents[3]
    console.log(`messageAfterLanguage: ${messageAfterLanguage}`);
    console.log(`additionalParams: ${additionalParams}`);
    
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
      case MessageAfterLanguage.start:
        ctx.startPayload = additionalParams
        await sendStart(ctx)
        break
      case MessageAfterLanguage.startGroup:
        await sendStartGroup(ctx)
        break
      case MessageAfterLanguage.notAdmin:        
        await sendNotAdmin(ctx)
        break
      default:
        break
    }
  }
}

function languageKeyboard(messageAfterLanguage: MessageAfterLanguage, additionalParams?: string) {
  const locales = localesFiles()
  const result = []
  locales.forEach((locale, index) => {
    const localeCode = locale.split('.')[0]
    const localeName = safeLoad(
      readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8')
    ).name
    const localeData = `l~${localeCode}~${messageAfterLanguage}~${additionalParams ?? ''}`
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
