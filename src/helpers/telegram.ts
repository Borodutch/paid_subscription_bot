import { Telegram } from 'telegraf'

export const telegram = new Telegram(process.env.TOKEN)
