import * as utils from 'utils'

export async function customersCreate({
  name,
  email,
  username
}: {
  name: string
  email: string
  username: string
}) {
  return utils.localApi.post(utils.apiRoutes.local.pagarme.customers.create, {
    name,
    email,
    username
  })
}
