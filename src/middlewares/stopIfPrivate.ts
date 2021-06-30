import { Context } from 'telegraf'

export const stopIfPrivate = (ctx: Context, next: () => void) => {
  sendStart  if (ctx.myChatMember.chat.type === 'private') {
    return
  }
  return next()
}
