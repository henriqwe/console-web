import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getCustomersCards } from '.'
import * as services from 'services'

jest.mock('utils/api', () => {
  const axios = require('axios')
  const localApi = axios.create({
    baseURL: `http://localhost:3000`
  })
  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  return {
    api,
    localApi
  }
})

describe('getCustomersCards function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const userData = await services.ycodify.getUserData({
        accessToken: userToken.data.access_token
      })
      const result = await getCustomersCards({
        gatewayPaymentKey: userData.gatewayPaymentKey
      })
      expect(result.status).toEqual(200)
    })
  })
})
