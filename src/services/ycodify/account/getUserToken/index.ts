import * as utils from 'utils'
import { stringify } from 'qs'

export async function getUserToken({
  username,
  password
}: {
  username: string
  password: string
}) {
  return utils.api.post(
    utils.apiRoutes.getUserToken,
    stringify({
      username,
      password,
      grant_type: 'password'
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic '.concat(
          Buffer.from('yc:c547d72d-607c-429c-81e2-0baec7dd068b').toString(
            'base64'
          )
        )
      }
    }
  )
}
