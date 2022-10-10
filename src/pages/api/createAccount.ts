import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

export default async function createAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const username = req.body.username
      const password = req.body.password
      const email = req.body.email

      await utils.api.post(
        utils.apiRoutes.createAccount,
        {
          username,
          password,
          email
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-TenantID': '38bc66c9-dd2d-3ea5-8eb3-51a4f84469'
          }
        }
      )
      
      return res.status(200).json({})
    } catch (err: any) {
      console.log(err)
      return res.status(err.response.status).json({ err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}
