import I18N from 'telegraf-i18n'
import { Chat } from '@/models'
import { DocumentType } from '@typegoose/typegoose'

declare module 'telegraf' {
  export class Context {
    dbchat: DocumentType<Chat>
    i18n: I18N
    startPayload?: string
  }
}
