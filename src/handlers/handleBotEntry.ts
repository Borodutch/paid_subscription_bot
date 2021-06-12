import { sendLanguage } from '@/handlers/language'
import { sendHelp } from '@/handlers/sendHelp'
import { Context } from 'telegraf'

export function handleBotEntry(ctx: Context) {
  // TODO: handle case when bot is an admin right awai
  // Check if it's an entry
  if (
    !['kicked', 'left'].includes(ctx.myChatMember.old_chat_member.status) ||
    !['member', 'restricted'].includes(ctx.myChatMember.new_chat_member.status)
  ) {
    return
  }
  if (!ctx.dbchat.language) {
    return sendLanguage(true)(ctx)
  }
  return sendHelp(ctx)
}
