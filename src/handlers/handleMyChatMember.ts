import { sendStart } from '@/handlers/handleStart'
import { sendLanguage } from '@/handlers/language'
import { Context } from 'telegraf'
import { sendNotAdmin } from './sendNotAdmin'

export function handleMyChatMember(ctx: Context) {
  // The bot is admin now, send start
  if (ctx.myChatMember.new_chat_member.status === 'administrator') {
    if (!ctx.dbchat.language) {
      return sendLanguage('start')(ctx)
    }
    return sendStart(ctx)
  }
  // Check if it's an entry
  if (
    ['kicked', 'left'].includes(ctx.myChatMember.old_chat_member.status) &&
    ['member', 'restricted'].includes(ctx.myChatMember.new_chat_member.status)
  ) {
    if (!ctx.dbchat.language) {
      return sendLanguage('notAdmin')(ctx)
    }
    return sendNotAdmin(ctx)
  }
}
