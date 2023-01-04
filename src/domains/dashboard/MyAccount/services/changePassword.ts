import * as utils from 'utils'

export async function changePassword({
  username,
  password,
  oldPassword
}: {
  username: string
  password: string
  oldPassword: string
}) {
  return utils.api.post(
    utils.apiRoutes.changePassword,
    {
      username,
      password,
      oldPassword
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
