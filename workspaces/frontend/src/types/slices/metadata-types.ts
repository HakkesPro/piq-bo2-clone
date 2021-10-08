import type { PaymentIqRoles } from 'types/service/metadata';

export type Merchants = Merchant[]

export type Merchant = {
  key: number,
  text: string,
  value: number,
  className?: string
}

export type State = {
  roles: Array<PaymentIqRoles>,
  merchants: Merchants
}
