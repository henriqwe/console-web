import * as utils from 'utils'

export async function changePasswordRecoveryHash({
  username,
  password,
  passwordRecoveryHash
}: {
  username: string
  password: string
  passwordRecoveryHash: string
}) {
  return utils.api.post(utils.apiRoutes.changePassword, {
    username,
    password,
    passwordRecoveryHash
  })
}
