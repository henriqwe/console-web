import * as utils from 'utils'

export async function updateRole({
  adminUsername,
  password,
  XTenantID,
  role
}: {
  adminUsername: string
  password: string
  XTenantID: string
  role: {
    name: string
    status: number
  }
}) {
  return utils.api.post(
    utils.apiRoutes.updateRole,
    {
      username: adminUsername,
      password: password,
      role: role
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-TenantID': XTenantID
      }
    }
  )
}
