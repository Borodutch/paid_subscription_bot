import {
  prop,
  getModelForClass,
  Ref,
  Severity,
  modelOptions,
} from '@typegoose/typegoose'
import { Subscription } from '@/models/Subscription'

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Price {
  @prop({ required: true })
  username: string
  @prop({ required: true })
  chatId: number
  @prop({ required: true, ref: 'Subscription' })
  subscription: Ref<Subscription>
  @prop({ required: true })
  amount: { ethAmount: number }
}

export const PriceModel = getModelForClass(Price)
