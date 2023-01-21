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
