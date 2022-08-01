import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

export default async function interpreter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const sendDate = new Date().getTime()

      // g0voBnPhLWq2pRMv
      const { data } = await utils.api.post(
        utils.apiRoutes.interpreter,
        req.body.data,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${req.body.access_token}`,
            'X-TenantID': `${req.body['X-TenantID']}`,
            'X-TenantAC': `${req.body['X-TenantAC']}`,
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


// mesmo q atributo mudando para association