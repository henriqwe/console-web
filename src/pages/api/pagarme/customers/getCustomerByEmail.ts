import { NextApiRequest, NextApiResponse } from 'next'
import { handleCustomerList } from './list'

export default async function getCustomerByEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const data = await handleCustomerList()

      const customer =
        data?.filter((customer) => customer.email === req.query.email)[0] ?? {}
      return res.status(200).json(customer)
    } catch (err: any) {
      return res
        .status(err?.response?.status || 400)
        .json({ message: err.message ?? err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}
