import { Context, Markup as m } from 'telegraf'
import { ChatModel, findChat } from '@/models/Chat'

export async function checkAdmin(ctx: Context, next: () => void) {
  let user = await findChat(ctx.from.id)

  if (!!user.adminChats.length) {
    const buttons = []
    for (let adminChat of user.adminChats) {
      let chat = await ctx.telegram.getChat(adminChat)
      buttons.push(m.button.callback(chat['title'], adminChat))
    }

    return ctx.reply(ctx.i18n.t('check_admin_true'), m.inlineKeyboard(buttons))
  } else {
    return ctx.reply(ctx.i18n.t('configure_no_subscriptions'))
  }
}
