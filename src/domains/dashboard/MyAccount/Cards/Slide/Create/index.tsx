import * as common from 'common'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  useForm,
  FieldValues,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import * as utils from 'utils'
import { useEffect, useState } from 'react'
import { useUser } from 'contexts/UserContext'
type formData = {
  cvv: string
  expiry: string
  name: string
  number: string
}
import * as creditCardContext from 'domains/dashboard/MyAccount/Cards/CreditCardContext'
import * as services from 'services'
import * as yup from 'yup'

export function Create() {
  const [loading, setLoading] = useState(false)
  const [cardBrand, setCardBrand] = useState<string>()
  const { user } = useUser()
  const { setCreditCardNumber, creditCardNumber, setOpenSlide, getCards } =
    creditCardContext.useData()

  const {
    formState: { errors },
    handleSubmit,
    watch,
    control
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
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
            return validation
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

            const expiryCreditCard = new Date(
              Number(`20${year}`),
              Number(month),
              1
            )
            if (new Date() > expiryCreditCard) {
              return false
            }

            return true
          }),
        name: yup.string().required('This field is required')
      })
    )
  })

  async function onSubmit(formData: formData) {
    setLoading(true)
    try {
      if (!user?.gatewayPaymentKey) {
        throw new Error('Ops! Something wrong happened')
      }
      if (!cardBrand) {
        throw new Error('Unidentified credit card brand')
      }

      const [month, year] = formData.expiry.split('/')
      const brandName = utils.handleBrandName(cardBrand!)

      await services.pagarme.createCard({
        customerId: user?.gatewayPaymentKey,
        number: formData.number,
        holder_name: formData.name,
        exp_month: month,
        exp_year: year,
        cvv: formData.cvv,
        brand: brandName,
        line_1: `${user?.userData?.addrNumber}, ${user?.userData?.addrStreet}`,
        zip_code: user?.userData?.addrZip,
        city: user?.userData?.addrCity,
        state: user?.userData?.addrDistrict,
        country: user?.userData?.addrCountry
      })

      await getCards()
      setOpenSlide(false)
      utils.notification('Credit card successfully added', 'success')
    } catch (err) {
      console.log('err',err)
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCreditCardNumber(undefined)
  }, [])

  useEffect(() => {
    if (watch('number') && watch('number')?.length > 14) {
      const brand = utils.getCardBrand(watch('number'))
      if (brand) {
        setCardBrand(brand)
        setCreditCardNumber(watch('number'))
        return
      }
      setCardBrand(undefined)
    }
  }, [watch('number')])

  return (
    <div className="flex flex-col gap-8">
      <common.CreditCard
        brand={cardBrand}
        cvv={watch('cvv')}
        expiry={watch('expiry')}
        name={watch('name')}
        number={watch('number')}
      />
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
      >
        <Controller
          name="name"
          control={control}
          defaultValue={''}
          render={({ field: { onChange } }) => (
            <div className="w-full">
              <common.Input
                placeholder="Cardholder"
                className="w-full"
                label="Cardholder"
                onChange={onChange}
                errors={errors.name}
              />
            </div>
          )}
        />
        <Controller
          name="number"
          control={control}
          defaultValue={''}
          render={({ field: { onChange } }) => (
            <div className="w-full">
              <common.Input
                placeholder="Card number"
                className="w-full"
                label="Card number"
                onChange={onChange}
                errors={errors.number}
                maxLength={16}
              />
            </div>
          )}
        />

        <div className="flex justify-between gap-4">
          <div className="w-[40%]">
            <common.ExpiryCreditCardInput
              placeholder="Expiry"
              className="w-full"
              error={errors.expiry}
              control={control}
            />
          </div>
          <div className="w-[30%]">
            <Controller
              name="cvv"
              control={control}
              defaultValue={''}
              render={({ field: { onChange } }) => (
                <div className="w-full">
                  <common.Input
                    placeholder="CVV"
                    className="w-full"
                    label="CVV"
                    onChange={onChange}
                    errors={errors.cvv}
                    maxLength={4}
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <common.Buttons.Ycodify
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create
          </common.Buttons.Ycodify>
        </div>
      </form>
    </div>
  )
}
