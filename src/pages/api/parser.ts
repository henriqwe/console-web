import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function schemas(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { data } = await axios.get(
        `https://api.ycodify.com/api/modeler/parser/reverse/${req.query.parserName}`,
        {
          headers: {
            'Content-Type': 'text/plain;charset=ISO-8859-1',
            Accept: 'text/plain;charset=ISO-8859-1',
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