import * as creditCardContext from 'domains/dashboard/MyAccount/Cards/CreditCardContext'
import { PlusIcon } from '@heroicons/react/outline'
import { useUser } from 'contexts/UserContext'
import * as utils from 'utils'
export function CardNewCreditCard() {
  const { setOpenSlide, setSlideType, setSlideSize } =
    creditCardContext.useData()
  const { user } = useUser()

  const {
    addrStreet,
    addrNumber,
    addrCountry,
    addrDistrict,
    addrCity,
    addrZip
  } = user?.userData || {}

  return (
    <div
      className="flex flex-col items-center justify-center p-4 border-2 border-dashed cursor-pointer w-52 h-52"
      onClick={() => {
        for (const data of [
          addrStreet,
          addrNumber,
          addrCountry,
          addrDistrict,
          addrCity,
          addrZip
        ]) {
          if (data === '' || data === undefined) {
            utils.notification(
              'Please complete the address registration',
              'error'
            )
            return
          }
        }
        setSlideType('createCreditCard')
        setSlideSize('normal')
        setOpenSlide(true)
      }}
    >
      <div className="flex flex-col items-center justify-start dark:text-text-primary text-slate-900">
        <PlusIcon className="w-8 h-8" />
        <span className="text-lg font-semibold ">Add new card</span>
      </div>
    </div>
  )
}
