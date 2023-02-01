import * as utils from 'utils'

export async function runInterpreter({
  data,
  accessToken,
  XTenantID,
  XTenantAC
}: {
  data: string
  accessToken: string
  XTenantID: string
  XTenantAC: string
}) {
  return utils.localApi.post(
    utils.apiRoutes.local.interpreter,
    {
      data: JSON.parse(data),
      access_token: accessToken,
      'X-TenantID': XTenantID,
      'X-TenantAC': XTenantAC
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
