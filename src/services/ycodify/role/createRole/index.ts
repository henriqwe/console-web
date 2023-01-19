import * as utils from 'utils'

export async function createRole({
  username,
  password,
  Name,
  Status,
  XTenantID
}: {
  username: string
  password: string
  Status: number
  Name: string
  XTenantID: string
}) {
  return utils.api.post(
    utils.apiRoutes.createRole,
    {
      username: username,
      password: password,
      role: {
        name: Name,
        status: Status
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-TenantID': XTenantID
      }
    }
  )
}
