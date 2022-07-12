import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function schemas(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/parser/parse`,
        {
          name: req.query.parserName
        },
        {
          headers: {
            'Content-Type': 'text/plain;',
            Accept: 'text/plain;',
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