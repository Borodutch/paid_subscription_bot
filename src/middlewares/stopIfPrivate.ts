import { Context } from 'telegraf'

export const stopIfPrivate = (ctx: Context, next: () => void) => {
  if (ctx.chat.type === 'private') {
    return
  }
  return next()
}
