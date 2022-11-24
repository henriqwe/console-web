import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

const validationArray = ['customerId', 'cardId']

export default async function deleteCard(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      utils.validationReqBody({
        body: req.body,
        validationArray
      })

      const { data } = await utils.apiPagarme.delete(
        utils.apiPagarmeRoutes.cards.delete(
          req.body.customerId as string,
          req.body.cardId as string
        ),
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
        .json({ message: err.message ?? err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}
