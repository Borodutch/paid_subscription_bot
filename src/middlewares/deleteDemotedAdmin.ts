import { findChat } from '@/models'
import { Context } from 'telegraf'

export async function deleteDemotedAdmin(ctx: Context, next: () => void) {
  if (
    ctx.chatMember.old_chat_member.status === 'administrator' &&
    ctx.chatMember.new_chat_member.status !== 'administrator'
  ) {
    const chat = await findChat(ctx.chat.id)
    const user = await findChat(ctx.chatMember.new_chat_member.user.id)

    const indexOfDemotedAdmin = chat.administratorIds.indexOf(user.id)
    const indexOfChat = user.adminChats.indexOf(chat.id)

    if (indexOfDemotedAdmin !== -1 && indexOfChat !== -1) {
      chat.administratorIds.splice(indexOfDemotedAdmin, 1)
      user.adminChats.splice(indexOfChat, 1)

      Promise.all([await chat.save(), await user.save()])
      return next()
    }
  }
  return next()
}
