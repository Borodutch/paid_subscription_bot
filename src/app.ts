import { localeActions } from './handlers/language'
// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { bot } from '@/helpers/bot'
import { ignoreOldMessageUpdates } from '@/middlewares/ignoreOldMessageUpdates'
import { sendHelp } from '@/handlers/sendHelp'
import { handleStart } from '@/handlers/handleStart'
import { i18n, attachI18N } from '@/helpers/i18n'
import { setLanguage, sendLanguage } from '@/handlers/language'
import { attachChat } from '@/middlewares/attachChat'
import { handleMyChatMember } from '@/handlers/handleMyChatMember'
import { toggleNotifications } from '@/handlers/toggleNotifications'
import { stopIfPrivate } from '@/middlewares/stopIfPrivate'
import {
  handleConfigureSubscriptions,
  sendConfigureSingleSubscription,
} from '@/handlers/handleConfigureSubscriptions'
import { stopIfPublic } from '@/middlewares/stopIfPublic'
import { extractConfigureChat } from '@/middlewares/extractConfigureChat'
import {
  handleConfigureMessage,
  handleConfigureWallet,
  handleConfigurePay,
} from '@/handlers/handleConfigureSubscriptions'

// Middlewares
bot.use(ignoreOldMessageUpdates)
bot.use(attachChat)
bot.use(i18n.middleware(), attachI18N)
// Commands
bot.help(sendHelp)
bot.start(handleStart)
bot.command('language', sendLanguage())
bot.command('notifications', toggleNotifications)
bot.command(
  'configureSubscriptions',
  stopIfPublic,
  handleConfigureSubscriptions
)
// Actions
bot.action(/l~.+/, setLanguage)
bot.action(/config~.+/, extractConfigureChat, sendConfigureSingleSubscription)
bot.action(/wallet~.+/, handleConfigureWallet)
bot.action(/pay~.+/, handleConfigurePay)
// Handlers
bot.on('my_chat_member', stopIfPrivate, handleMyChatMember)
bot.on('message', handleConfigureMessage)
// Errors
bot.catch(console.error)
// Start bot
bot.launch().then(() => {
  console.info(`Bot ${bot.botInfo.username} is up and running`)
})
