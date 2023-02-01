import { useEffect } from 'react'
import * as common from 'common'
import * as utils from 'utils'

import { CardNewCreditCard } from './CardNewCreditCard'
import { Slide } from './Slide'
import { FromAddress } from './FromAddress'
import * as creditCardContext from 'domains/dashboard/MyAccount/Cards/CreditCardContext'
import { CardCreditCard } from './CardCreditCard'

export function Cards() {
  const { getCards, loading, cardsData } = creditCardContext.useData()

  useEffect(() => {
    getCards()
  }, [])

  return (
    <div className="flex flex-col gap-4 px-4 overflow-auto">
      <section className="flex flex-col gap-y-8 ">
        <p className="text-2xl font-semibold dark:text-text-primary text-slate-900">
          Your credit cards
        </p>

        <div className="flex items-center justify-center w-full">
          {loading ? (
            <common.Spinner
              className="w-8 h-8 dark:text-text-primary"
              data-testid="spinner"
            />
          ) : (
            <div className="flex w-full h-auto gap-6 px-8">
              <CardNewCreditCard />
              {cardsData.length > 0 &&
                cardsData.map((card) => (
                  <CardCreditCard
                    key={card.id}
                    brand={utils.handleBrandName(card.brand, true)}
                    created_at={card.created_at}
                    exp_month={card.exp_month}
                    exp_year={card.exp_year}
                    first_six_digits={card.first_six_digits}
                    holder_name={card.holder_name}
                    id={card.id}
                    last_four_digits={card.last_four_digits}
                    status={card.status}
                    type={card.type}
                    updated_at={card.updated_at}
                  />
                ))}
            </div>
          )}
        </div>
      </section>
      <common.Separator />
      <FromAddress />
      <Slide />
    </div>
  )
}
