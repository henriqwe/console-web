import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getUserData } from '.'
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

describe('getUserData function', () => {
  it('should get user data', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await getUserData({
        accessToken: userData.data.access_token
      })

      expect(typeof result.roles).toBe('object')
      expect(typeof result.contracts).toBe('object')
      expect(typeof result.status).toBe('number')

      expect(result.addrState).toEqual('')
      expect(result.addrZip).toEqual('57084079')
      expect(result.addrCountry).toEqual('BR')
      expect(result.addrCity).toBe('Maceió')
      expect(result.addrStreet).toBe('Rua são caetano')
      expect(result.addrNumber).toBe('105')
      expect(result.gatewayPaymentKey).toBe('cus_EvM50rLHzjFeozWq')
      expect(result.addrStreet).toBe('Rua são caetano')
      expect(result.addrDistrict).toBe('AL')

      expect(result.id).toBe(212)
      expect(result.name).toBe('claudio henrique')
      expect(result.email).toBe('chteste@gmail.com')
    })
  })
})

// response exemple
// {
//   logUpdatedAt: 1673232007782,
//   addrState: '',
//   addrZip: '57084079',
//   roles: [ { name: 'ROLE_CLIENT_API_MASTER' } ],
//   addrCountry: 'BR',
//   contracts: [
//     {
//       service: [Object],
//       id: 40,
//       uuid: '6c5fa35f-0125-3f8e-b3c2-9a1e4c365896',
//       status: 1
//     }
//   ],
//   addrCity: 'Maceió',
//   addrStreet: 'Rua são caetano',
//   addrNumber: '105',
//   gatewayPaymentKey: 'cus_EvM50rLHzjFeozWq',
//   logCreatedAt: 1668994526355,
//   name: 'claudio henrique',
//   id: 212,
//   addrDistrict: 'AL',
//   email: 'chteste@gmail.com',
//   username: 'chteste',
//   status: 1
// }
