import * as common from 'common'
import { Create } from './Create'
import * as creditCardContext from 'domains/dashboard/MyAccount/Cards/CreditCardContext'

export function Slide() {
  const { openSlide, setOpenSlide } = creditCardContext.useData()

  return (
    <common.Slide
      open={openSlide}
      setOpen={() => setOpenSlide(false)}
      title={'Adding credit card'}
      content={<Create />}
    />
  )
}
