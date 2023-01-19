import * as utils from 'utils'

export async function getSchemas({ accessToken }: { accessToken: string }) {
  return utils.api.get(utils.apiRoutes.schemas, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}
