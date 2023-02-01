import * as utils from 'utils'

export async function getParser({
  name,
  accessToken
}: {
  name: string
  accessToken: string
}) {
  return utils.localApi.get(utils.apiRoutes.local.parser(name as string), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
