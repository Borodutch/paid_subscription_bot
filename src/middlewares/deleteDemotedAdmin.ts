import { ChatModel } from '@/models'
import { Context } from 'telegraf'

export async function deleteDemotedAdmin(ctx: Context, next: () => void) {
  if (
    ctx.chatMember.old_chat_member.status === 'administrator' &&
    ctx.chatMember.new_chat_member.status !== 'administrator'
  ) {
    let chat = await ChatModel.findOne({ id: ctx.chat.id })
    const indexOfDemotedAdmin = chat.administratorIds.indexOf(
      ctx.chatMember.new_chat_member.user.id
    )

    chat.administratorIds.splice(indexOfDemotedAdmin, 1)
    await chat.save()

    return next()
  }
  return next()
}
