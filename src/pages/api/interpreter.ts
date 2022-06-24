import { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'qs'
import axios from 'axios'

export default async function interpreter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const username = 'tester@academia'
      const password = '1234567'
      const { data: tokenData } = await axios.post(
        `https://api.ycodify.com/api/csecurity/oauth/token`,
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

      const { data } = await axios.post(
        `https://api.ycodify.com/api/interpreter-p/s`,
        req.body.data,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `${tokenData.access_token}`,
            'X-TenantID': 'tester@academia'
          }
        }
      )

      return res.status(200).json({ data: data.data })
    } catch (err) {
      console.log(err)
      return res.status(404).json({ err: err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}
