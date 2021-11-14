import { findChat } from '@/models'
import { Context } from 'telegraf'

export async function deleteDemotedAdmin(ctx: Context) {
  if (
    ctx.chatMember.old_chat_member.status === 'administrator' &&
    ctx.chatMember.new_chat_member.status !== 'administrator'
  ) {
    const chat = await findChat(ctx.dbchat.id)
    await chat.updateOne({
      $pull: { administratorIds: ctx.chatMember.new_chat_member.user.id },
    })
  }
}
