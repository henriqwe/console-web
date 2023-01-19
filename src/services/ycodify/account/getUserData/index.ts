import * as utils from 'utils'

export async function getUserData({ accessToken }: { accessToken: string }) {
  const { data } = await utils.api.get(utils.apiRoutes.userData, {
    headers: {
      Authorization: accessToken as string
    }
  })
  return data
}
