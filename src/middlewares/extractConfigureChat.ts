import { Context } from 'telegraf'
import { ChatModel } from '@/models/Chat'

export const extractConfigureChat = async (ctx: Context, next: () => void) => {
  if (!('data' in ctx.callbackQuery)) {
    return
  }

  const id = +ctx.callbackQuery.data.split('~')[1]
  ctx.userChats = [
    await ChatModel.findOne({
      id,
    }),
  ]

  return next()
}
