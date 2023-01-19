import * as utils from 'utils'

export async function adminLogin({
  username,
  password
}: {
  username: string
  password: string
}) {
  return utils.localApi.post(utils.apiRoutes.local.adminLogin, {
    username: username,
    password: password
  })
}
