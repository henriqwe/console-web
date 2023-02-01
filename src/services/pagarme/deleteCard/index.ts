import * as utils from 'utils'

export async function deleteCard({
  customerId,
  cardId
}: {
  customerId: string
  cardId: string
}) {
  return utils.localApi.post(utils.apiRoutes.local.pagarme.cards.delete, {
    customerId,
    cardId
  })
}
