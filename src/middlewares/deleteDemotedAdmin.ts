import { findChat } from '@/models'
import { Context } from 'telegraf'

export async function deleteDemotedAdmin(ctx: Context, next: () => void) {
  if (
    ctx.chatMember.old_chat_member.status === 'administrator' &&
    ctx.chatMember.new_chat_member.status !== 'administrator'
  ) {
    const chat = await findChat(ctx.chat.id)

    const indexOfDemotedAdmin = chat.administratorIds.indexOf(
      ctx.chatMember.new_chat_member.user.id
    )

    if (indexOfDemotedAdmin !== -1) {
      chat.administratorIds.splice(indexOfDemotedAdmin, 1)

      await chat.save()
      return next()
    }
  }
  return next()
}
