import { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'qs'
import axios from 'axios'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const username = req.body.username
      const password = req.body.password
      const email = req.body.email

      await axios.post(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/account/account`,
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

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/security/oauth/token`,
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
