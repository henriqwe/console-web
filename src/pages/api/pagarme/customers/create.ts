import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

export default async function createCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await validationReqBody(req.body)

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

function validationReqBody(body: { [variable: string]: string }) {
  const validationArray = ['email', 'name']
  for (const key of validationArray) {
    if (!body[key]) {
      throw new Error(`${key} is required`)
    }
  }
}
