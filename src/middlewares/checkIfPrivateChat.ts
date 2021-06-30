import { Context } from 'telegraf';


export const stopIfPrivate = (ctx: Context, next: () => void) => {
  // continue if chat is private
  if (ctx.myChatMember.chat.type === 'private') {
    return 
  }
  return next()
}