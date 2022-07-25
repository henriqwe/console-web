import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function interpreter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const sendDate = new Date().getTime()

      // g0voBnPhLWq2pRMv
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/interpreter-p/s`,
        req.body.data,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${req.body.access_token}`,
            'X-TenantID': `${req.body['X-TenantID']}`
          }
        }
      )

      const receiveDate = new Date().getTime()
      const responseTimeMs = receiveDate - sendDate

      return res
        .status(200)
        .json({ data: data.data ? data.data : data, responseTimeMs })
    } catch (err) {
      console.log(err)
      return res.status(404).json({ err: err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}
