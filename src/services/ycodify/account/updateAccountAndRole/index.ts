import * as utils from 'utils'

export async function updateAccountAndRole({
  username,
  password,
  usernameAdmin,
  roles
}: {
  username: string
  password: string
  usernameAdmin: string
  roles: {
    name: string
  }[]
}) {
  return utils.api.post(utils.apiRoutes.updateAccount, {
    username: usernameAdmin,
    password: password,
    account: { username: username, roles }
  })
}
