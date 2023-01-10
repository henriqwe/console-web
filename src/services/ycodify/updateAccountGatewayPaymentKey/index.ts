import * as utils from 'utils'

export async function updateAccountGatewayPaymentKey({
  username,
  password,
  gatewayPaymentKey,
  accessToken
}: {
  username: string
  password: string
  gatewayPaymentKey: string
  accessToken: string
}) {
  return utils.api.post(
    utils.apiRoutes.updateAccount,
    {
      username,
      password,
      gatewayPaymentKey
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken as string
      }
    }
  )
}
