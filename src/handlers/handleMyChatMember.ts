import { sendStart } from '@/handlers/handleStart'
import { sendLanguage } from '@/handlers/language'
import { Context } from 'telegraf'
import { sendNotAdmin } from './sendNotAdmin'
import { MessageAfterLanguage } from './language';

export function handleMyChatMember(ctx: Context) {
  if (ctx.myChatMember.chat.type === 'private') {
    return
  }
  
  // The bot is admin now, send start
  if (ctx.myChatMember.new_chat_member.status === 'administrator') {
    if (!ctx.dbchat.language) {
      return sendLanguage(MessageAfterLanguage.startGroup)(ctx)
    }
    return sendStartGroup(ctx)
  }
  // Check if it's an entry
  if (
    ['kicked', 'left'].includes(ctx.myChatMember.old_chat_member.status) &&
    ['member', 'restricted'].includes(ctx.myChatMember.new_chat_member.status)
  ) {
    if (!ctx.dbchat.language) {
      return sendLanguage(MessageAfterLanguage.notAdmin)(ctx)
    }    
    return sendNotAdmin(ctx)
  }
}

export function sendStartGroup(ctx: Context) {
  return ctx.replyWithHTML(
    ctx.i18n.t('start_group', {
      chatId: ctx.chat.id,
      botName: ctx.botInfo.username,
    }),
    {
      disable_web_page_preview: true,
    }
  )
}
