import { TrashIcon, StarIcon } from '@heroicons/react/outline'
import * as creditCardContext from 'domains/dashboard/MyAccount/Cards/CreditCardContext'
import { useState } from 'react'
import * as common from 'common'
import * as utils from 'utils'

type CardCreditCardProps = {
  brand: string
  created_at: string
  exp_month: number
  exp_year: number
  first_six_digits: string
  holder_name: string
  id: string
  last_four_digits: string
  status: string
  type: string
  updated_at: string
}
export function CardCreditCard(card: CardCreditCardProps) {
  const { deleteCard, getCards } = creditCardContext.useData()
  const [openModal, setOpenModal] = useState(false)

  async function handleDeleteCard() {
    await deleteCard(card.id)
    await getCards()
    utils.notification('Credit card removed successfully', 'success')
  }

  return (
    <div className="flex flex-col border-2 w-52 h-52">
      <div className="flex flex-col justify-between w-full h-full p-4">
        <div className="flex justify-between">
          <div className="flex items-center justify-center">
            <span className="dark:text-text-primary">
              **********
              {card.last_four_digits}
            </span>
          </div>
          <div className="flex justify-end h-6 ">
            <img
              src={`/assets/images/creditCardBrands/${card.brand}.svg`}
              alt="credit card brand"
              className="w-10"
            />
          </div>
        </div>

        <div className="flex items-center justify-between ">
          <div className="flex flex-col dark:text-text-primary">
            <span className="font-light text-tiny">Created at</span>
            <span className="text-xs">
              {new Date(card.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-col dark:text-text-primary">
            <span className="font-light text-tiny">Expiration date</span>
            <span className="text-xs">
              {card.exp_month}/{card.exp_year.toString().slice(2, 4)}
            </span>
          </div>
        </div>
        <div className="flex flex-col dark:text-text-primary">
          <span className="font-light text-tiny">Holder</span>
          <span className="truncate" title={card.holder_name}>
            {card.holder_name}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 text-tiny dark:bg-slate-700">
        <div>
          {card.id === 'card_VJP4q98JuvfKM9wO' ? (
            <StarIcon
              className={`w-5 h-5 text-yellow-500 fill-yellow-300`}
              data-testid="starIcon"
            />
          ) : (
            <div className="dark:text-text-primary text-slate-900 hover:cursor-pointer">
              Set default
            </div>
          )}
        </div>

        <div>
          {card.id !== 'card_VJP4q98JuvfKM9wO' && (
            <div onClick={() => setOpenModal(true)}>
              <TrashIcon className="w-5 h-5 text-red-500 hover:cursor-pointer" data-testid="trashIcon" />
            </div>
          )}
        </div>
      </div>
      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        title={`Remove credit card?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this credit card?
            </p>
            <div className="flex items-center justify-center w-full p-4 ">
              {' '}
              <span className="font-semibold">
                **********{card.last_four_digits}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-600">
              This action is irreversible
            </p>
          </>
        }
        buttonTitle="Remove"
        handleSubmit={handleDeleteCard}
      />
    </div>
  )
}
