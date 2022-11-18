import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'
import { customerType } from './types'

export default async function customerList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const data = await handleCustomerList()
      return res.status(200).json(data)
    } catch (err: any) {
      return res
        .status(err?.response?.status || 400)
        .json({ message: err.message ?? err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}

export async function handleCustomerList(): Promise<customerType[]> {
  const { data } = await utils.apiPagarme.get(
    utils.apiPagarmeRoutes.customers.list,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.PAGARME_SK_BASE64}`
      }
    }
  )
  return data.data
}
