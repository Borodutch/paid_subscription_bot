import { findChat } from '@/models'
import { Context } from 'telegraf'

export async function attachChat(ctx: Context, next: () => void) {
  // Get and attach chat
  ctx.dbchat = await findChat(ctx.chat.id)
  // Check and attach language code if needed
  if (!ctx.dbchat.language && ctx.from.language_code) {
    const lowercaseLanguageCode = ctx.from.language_code?.toLowerCase()
    if (lowercaseLanguageCode.includes('en')) {
      ctx.dbchat.language = 'en'
      ctx.dbchat.save()
    } else if (lowercaseLanguageCode.includes('ru')) {
      ctx.dbchat.language = 'ru'
      ctx.dbchat.save()
    }
  }
  // Continue
  return next()
}
