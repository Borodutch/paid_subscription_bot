import { localeActions } from '@/handlers/language'
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
import { runMongo } from '@/models/index'
import { stopIfPublic } from '@/middlewares/stopIfPublic'
import { handleConfigureMessage } from '@/handlers/handleConfigureMessage'
import { handleCancel } from '@/handlers/handleCancel'
import { handleConfigureSubscription } from '@/handlers/handleConfigureSubscription'
import { handleSubscriptions } from '@/handlers/handleSubscriptions'
import { deleteDemotedAdmin } from '@/middlewares/deleteDemotedAdmin'
import { checkAdmin } from '@/middlewares/checkAdmin'

// Middlewares
bot.use(ignoreOldMessageUpdates)
bot.use(attachChat)
bot.use(i18n.middleware(), attachI18N)
// Commands
bot.help(sendHelp)
bot.start(handleStart)
bot.command('language', sendLanguage())
bot.command('notifications', toggleNotifications)
bot.command('configureSubscription', stopIfPublic, checkAdmin)
bot.command('cancel', handleCancel)
bot.command('subscriptions', handleSubscriptions)
// Actions
bot.action(/l~.+/, setLanguage)
bot.action(/^-\d+/, handleConfigureSubscription)
// Handlers
bot.on('my_chat_member', stopIfPrivate, handleMyChatMember)
bot.on('message', stopIfPublic, handleConfigureMessage)
bot.on('chat_member', deleteDemotedAdmin)
// Errors
bot.catch(console.error)
// Start bot
runMongo().then(() => {
  console.log('Mongo connected')
})
bot
  .launch({
    allowedUpdates: [
      'chat_member',
      'my_chat_member',
      'message',
      'callback_query',
    ],
  })
  .then(() => {
    console.info(`Bot ${bot.botInfo.username} is up and running`)
  })
