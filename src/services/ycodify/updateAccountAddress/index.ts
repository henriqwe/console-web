import * as utils from 'utils'

export async function updateAccountAddress({
  username,
  email,
  status,
  addrStreet,
  addrNumber,
  addrCountry,
  addrDistrict,
  addrCity,
  addrZip,
  accessToken
}: {
  username: string
  email: string
  status: string
  addrStreet: string
  addrNumber: string
  addrCountry: string
  addrDistrict: string
  addrCity: string
  addrZip: string
  accessToken: string
}) {
  return utils.api.post(
    utils.apiRoutes.updateAccount,
    {
      username,
      email,
      status,
      addrStreet,
      addrNumber,
      addrCountry,
      addrDistrict,
      addrCity,
      addrZip
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      }
    }
  )
}
