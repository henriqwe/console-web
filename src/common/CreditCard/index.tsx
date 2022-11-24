import { Icon } from '@iconify/react'
import * as utils from 'utils'
type CreditCardType = {
  number: string
  cvv: string
  expiry: string
  brand?: string
  name: string
}
export function CreditCard({
  number,
  cvv,
  expiry,
  brand,
  name
}: CreditCardType) {
  return (
    <div className=" flex flex-col w-full border-2 p-6 rounded-md shadow-lg">
      <div className=" flex justify-end h-6">
        {brand && (
          <img
            src={`/assets/images/creditCardBrands/${brand}.svg`}
            alt="credit card brand"
            className="w-10"
          />
        )}
      </div>
      <Icon
        icon="mdi:integrated-circuit-chip"
        className="w-10 h-10 text-yellow-400"
      />
      <div>
        <div className="h-6 text-lg">{utils.formatCardNumber(number)}</div>
      </div>
      <div className="flex justify-between">
        <div>
          <span className="text-tiny font-light">Month/Year</span>
          <div className="text-sm  h-6">{expiry}</div>
        </div>
        <div className="w-10">
          <span className="text-tiny font-light">CVV</span>
          <div className="text-sm h-6">{cvv}</div>
        </div>
      </div>
      <div>
        <div className="h-6 truncate">{name?.toLocaleUpperCase()}</div>
      </div>
    </div>
  )
}
