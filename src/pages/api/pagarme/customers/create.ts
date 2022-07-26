import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

const validationArray = ['email', 'name']

export default async function createCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      utils.validationReqBody({ body: req.body, validationArray })

      const { data } = await utils.apiPagarme.post(
        utils.apiPagarmeRoutes.customers.create,
        { ...req.body, metadata: { username: req.body?.username } },
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
