import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

const validationArray = ['customerId']

export default async function customerCardsList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      utils.validationReqBody({
        body: { customerId: req.query.customerId as string },
        validationArray
      })

      const data = await handleCustomerCardsList(req.query.customerId as string)
      return res.status(200).json(data)
    } catch (err: any) {
      return res
        .status(err?.response?.status || 400)
        .json({ message: err.message ?? err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}

export async function handleCustomerCardsList(customerId: string) {
  const { data } = await utils.apiPagarme.get(
    utils.apiPagarmeRoutes.cards.list(customerId),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.PAGARME_SK_BASE64}`
      }
    }
  )
  return data.data
}
