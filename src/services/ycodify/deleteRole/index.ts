import * as utils from 'utils'

export async function deleteRole({
  username,
  password,
  roleName
}: {
  username: string
  password: string
  roleName: string
}) {
  return utils.api.post(
    utils.apiRoutes.deleteRole,
    {
      username: username,
      password: password,
      role: {
        name: roleName
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
