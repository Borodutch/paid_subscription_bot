import { Context } from 'telegraf'

export const stopIfPublic = (ctx: Context, next: () => void) => {
  if (ctx.chat.type !== 'private') {
    return
  }
  return next()
}
