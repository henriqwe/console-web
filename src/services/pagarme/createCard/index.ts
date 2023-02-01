import * as utils from 'utils'

export async function createCard({
  holder_name,
  number,
  customerId,
  exp_month,
  exp_year,
  cvv,
  brand,
  line_1,
  zip_code,
  city,
  state,
  country
}: {
  holder_name: string
  number: string
  customerId: string
  exp_month: string
  exp_year: string
  cvv: string
  brand: string
  line_1: string
  zip_code: string
  city: string
  state: string
  country: string
}) {
  return utils.localApi.post(
    utils.apiRoutes.local.pagarme.cards.create,
    {
      customerId,
      number,
      holder_name,
      exp_month,
      exp_year,
      cvv,
      brand,
      line_1,
      zip_code,
      city,
      state,
      country
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
