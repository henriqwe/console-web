import { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'qs'
import * as utils from 'utils'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
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
            Authorization: 'Basic '.concat(
              Buffer.from('yc:c547d72d-607c-429c-81e2-0baec7dd068b').toString(
                'base64'
              )
            )
          }
        }
      )

      const { data } = await utils.api.post(
        utils.apiRoutes.getUserToken,
        stringify({
          username,
          password,
          grant_type: 'password'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic '.concat(
              Buffer.from('yc:c547d72d-607c-429c-81e2-0baec7dd068b').toString(
                'base64'
              )
            )
          }
        }
      )
      return res.status(200).json({ data })
    } catch (err: any) {
      console.log(err)
      return res.status(err.response.status).json({ err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}
