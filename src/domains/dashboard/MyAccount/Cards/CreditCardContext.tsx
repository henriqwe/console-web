import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
import * as yup from 'yup'
import * as utils from 'utils'
import * as services from 'services'

import { useUser } from 'contexts/UserContext'
type CreditCardContextProps = {
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  slideType: SlideType
  setSlideType: Dispatch<SetStateAction<SlideType>>
  slideSize: SlideSize
  setSlideSize: Dispatch<SetStateAction<SlideSize>>
  creditCardSchema: yup.AnyObjectSchema
  creditCardNumber: string | undefined
  setCreditCardNumber: Dispatch<SetStateAction<string | undefined>>
  getCards(): Promise<void>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  cardsData: CardType[]
  setCardsData: Dispatch<SetStateAction<CardType[]>>
  deleteCard(cardId: string): Promise<void>
}
export type CardType = {
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
type SlideType = 'createCreditCard'

type SlideSize = 'normal' | 'halfPage' | 'fullPage'

type ProviderProps = {
  children: ReactNode
}

export const CreditCardContext = createContext<CreditCardContextProps>(
  {} as CreditCardContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<SlideType>('createCreditCard')
  const [slideSize, setSlideSize] = useState<SlideSize>('normal')
  const [creditCardNumber, setCreditCardNumber] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [cardsData, setCardsData] = useState<CardType[]>([])
  const { user } = useUser()

  async function getCards() {
    setLoading(true)
    try {
      if (!user?.gatewayPaymentKey) {
        throw new Error('Unable to load credit cards')
      }
      const { data } = await services.pagarme.getCustomersCards({
        gatewayPaymentKey: user?.gatewayPaymentKey!
      })
      setCardsData(data)
    } catch (err) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  const creditCardSchema = yup.object().shape({
    number: yup
      .string()
      .min(14)
      .max(16)
      .test('equal', 'Number must contain only numbers', (val) => {
        const validation = new RegExp(/^[0-9]*$/)
        return validation.test(val as string)
      })
      .test('equal', 'Number invalid', (val) => {
        if (!val) {
          return false
        }
        const brand = utils.getCardBrand(val)
        if (brand) {
          return true
        }
        return false
      })
      .required('This field is required'),
    cvv: yup
      .string()
      .required('This field is required')
      .test('equal', 'Cvv must contain only numbers', (val) => {
        const validation = new RegExp(/^[0-9]*$/)
        return validation.test(val as string)
      })
      .test('equal', 'CVV invalid', (val) => {
        if (!val || !creditCardNumber) {
          return false
        }
        const validation = utils.validateCVV({
          creditCard: creditCardNumber,
          cvv: val
        })
        if (validation) {
          return true
        }
        return false
      }),
    expiry: yup
      .string()
      .required('This field is required')
      .test('equal', 'Invalid date', (val) => {
        if (!val) {
          return false
        }
        if (val.includes('_')) {
          return false
        }

        const [month, year] = val.split('/')
        if (Number(month) === 0 || Number(month) > 12) {
          return false
        }

        const expiryCreditCard = new Date(Number(`20${year}`), Number(month), 1)
        if (new Date() > expiryCreditCard) {
          return false
        }

        return true
      }),
    name: yup.string().required('This field is required')
  })

  async function deleteCard(cardId: string) {
    try {
      await services.pagarme.deleteCard({
        customerId: user?.gatewayPaymentKey!,
        cardId
      })
    } catch (err) {
      utils.showError(err)
    }
  }

  return (
    <CreditCardContext.Provider
      value={{
        openSlide,
        setOpenSlide,
        slideType,
        setSlideType,
        slideSize,
        setSlideSize,
        creditCardSchema,
        creditCardNumber,
        setCreditCardNumber,
        getCards,
        loading,
        setLoading,
        cardsData,
        setCardsData,
        deleteCard
      }}
    >
      {children}
    </CreditCardContext.Provider>
  )
}

export const useData = () => {
  return useContext(CreditCardContext)
}
