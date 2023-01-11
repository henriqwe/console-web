import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateAccountAddress } from '.'
import * as services from 'services'
jest.mock('utils/api', () => {
  const axios = require('axios')

  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  return {
    api
  }
})

describe('updateAccountAddress function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const userData = await services.ycodify.getUserData({
        accessToken: userToken.data.access_token
      })

      const result = await updateAccountAddress({
        username: userData.username,
        email: userData.email,
        status: userData.status,
        addrStreet: userData.addrStreet,
        addrNumber: userData.addrNumber,
        addrCountry: userData.addrCountry,
        addrDistrict: userData.addrDistrict,
        addrCity: userData.addrCity,
        addrZip: userData.addrZip,
        accessToken: userToken.data.access_token
      })

      expect(result.status).toEqual(200)
      expect(result.config.data).toEqual(
        '{"username":"chteste","email":"chteste@gmail.com","status":1,"addrStreet":"Rua são caetano","addrNumber":"105","addrCountry":"BR","addrDistrict":"AL","addrCity":"Maceió","addrZip":"57084079"}'
      )
    })
  })
})
