import { findChat, State } from '@/models'
import { Context } from 'telegraf'

export const handleCancel = async (ctx: Context) => {
  const configuredChat = await findChat(ctx.dbchat.configuredChatId)
  if (!configuredChat) {
    return
  }

  configuredChat.state = State.none
  await configuredChat.save()

  ctx.reply(ctx.i18n.t('cancel'))
}
