import * as utils from 'utils'

export async function getUserHash({ userName }: { userName: string }) {
  return utils.api.get(utils.apiRoutes.getUserHash({ username: userName }))
}
