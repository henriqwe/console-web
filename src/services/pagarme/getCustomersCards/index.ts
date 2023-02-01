import * as utils from 'utils'

export async function getCustomersCards({
  gatewayPaymentKey
}: {
  gatewayPaymentKey: string
}) {
  return utils.localApi.get(
    utils.apiRoutes.local.pagarme.cards.list(gatewayPaymentKey)
  )
}
