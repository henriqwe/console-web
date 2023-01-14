import { NextApiRequest, NextApiResponse } from 'next'
import * as utils from 'utils'

export default async function messageHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tenantAC = 'b44f7fc8-e2b7-3cc8-9a3d-04b3dac69886'
  const tenantID = '9316c346-4db5-35aa-896f-f61fe1a7d9d8'

  let response = { status: 400, data: { message: 'Bad request' } }

  if (req.method === 'GET') {
    try {
      const ticketid = req.query.ticketid

      response = await utils.api.post(
        utils.apiRoutes.interpreter,
        {
          action: 'READ',
          data: [
            {
              message: {
                ticketid
              }
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-TenantAC': tenantAC,
            'X-TenantID': tenantID
          }
        }
      )
    } catch (err: any) {
      console.log(err)
    }
  } else if (req.method === 'POST') {
    try {
      const message = req.body.message

      response = await utils.api.post(
        utils.apiRoutes.interpreter,
        JSON.stringify({
          action: 'CREATE',
          data: [
            {
              message: {
                ...message
              }
            }
          ]
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-TenantAC': tenantAC,
            'X-TenantID': tenantID
          }
        }
      )
    } catch (err: any) {
      console.log(err)
    }
  }

  return res.status(response.status).json(response.data)
}
