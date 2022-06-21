import { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'qs'
import axios from 'axios'

export default async function interpreter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { data } = await axios.post(
        `https://api.ycodify.com/api/interpreter-p/s`,
        stringify(req.body),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `${req.headers.authorization}`
          }
        }
      )
      return res.status(200).json({ data })
    } catch (err) {
      console.log(err)
      return res.status(404).json({ err: err })
    }
  }
  return res.status(404).json({ message: 'Not found! :(' })
}
