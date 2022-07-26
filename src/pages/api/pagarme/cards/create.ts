import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

const validationArray = [
  'customerId',
  'number',
  'holder_name',
  'exp_month',
  'exp_year',
  'cvv',
  'brand',
  'line_1',
  'zip_code',
  'city',
  'state',
  'country'
]

export default async function createCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      utils.validationReqBody({ body: req.body, validationArray })
      const billing_address = {
        line_1: req.body.line_1,
        zip_code: req.body.zip_code,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
      }
      const { data } = await utils.apiPagarme.post(
        utils.apiPagarmeRoutes.cards.create(req.body.customerId),
        { ...req.body, billing_address, verify_card: true },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.PAGARME_SK_BASE64}`
          }
        }
      )
      return res.status(200).json(data)
    } catch (err: any) {
      return res
        .status(err?.response?.status || 400)
        .json({ message: err?.response?.data?.errors?.card?.[0] ?? err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}

// reduzir o espaçamento entre username e org
// corrigir dropdown
