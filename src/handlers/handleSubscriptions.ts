import { getUserSubscriptions } from '@/models/Subscription'
import { Context } from 'telegraf'

export const handleSubscriptions = async (ctx: Context) => {
  const subscriptionData = await getUserSubscriptions(ctx.from.id)

  const subcriptionsArray = []
  for (let subscription of subscriptionData) {
    const telegramChat = await ctx.telegram.getChat(subscription.chatId)
    if (!('title' in telegramChat)) {
      return
    }

    subcriptionsArray.push(
      ctx.i18n.t('subscriptions_list_item', {
        channelName: telegramChat.title,
        ethAddress: subscription.accounts.eth.address,
        price:
          subscription.chat?.price.monthly.eth ??
          ctx.i18n.t('configure_price_undefined'),
      })
    )
  }

  const subscriptionsString = subcriptionsArray.join('\n')

  return ctx.reply(
    ctx.i18n.t('subscriptions_list', {
      subscriptionsString,
    })
  )
}
