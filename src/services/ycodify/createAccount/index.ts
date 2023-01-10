import * as utils from 'utils'

export async function createAccount({
  name,
  username,
  password,
  email
}: {
  name: string
  username: string
  password: string
  email: string
}) {
  return utils.localApi.post(utils.apiRoutes.local.createAccount, {
    name,
    username,
    password,
    email
  })
}
