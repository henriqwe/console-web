import * as utils from 'utils'

export async function updateUser({
  adminUsername,
  password,
  username,
  XTenantID,
  status,
  roles
}: {
  adminUsername: string
  password: string
  username: string
  XTenantID: string
  status: number
  roles: {
    name: string
  }[]
}) {
  return utils.api.post(
    utils.apiRoutes.updateAccount,
    {
      username: adminUsername,
      password: password,
      account: {
        username: username,
        roles,
        status: status
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
