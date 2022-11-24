import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

const validationArray = ['customerId', 'cardId']

export default async function getCard(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      utils.validationReqBody({
        body: {
          customerId: req.query.customerId as string,
          cardId: req.query.cardId as string
        },
        validationArray
      })

      const { data } = await utils.apiPagarme.get(
        utils.apiPagarmeRoutes.cards.getCard(
          req.query.customerId as string,
          req.query.cardId as string
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
