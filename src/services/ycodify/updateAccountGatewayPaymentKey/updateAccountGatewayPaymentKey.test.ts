import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateAccountGatewayPaymentKey } from '.'
import * as services from 'services'

jest.mock('utils/api', () => {
  const axios = require('axios')

  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  const localApi = axios.create({
    baseURL: `http://localhost:3000`
  })
  return {
    api,
    localApi
  }
})

describe('updateAccountGatewayPaymentKey function', () => {
  it('should get user hash', async () => {
    const userToken = await services.ycodify.getUserToken({
      password: '1231234',
      username: 'chteste'
    })
    const userData = await services.ycodify.getUserData({
      accessToken: userToken.data.access_token
    })

    await act(async () => {
      const result = await updateAccountGatewayPaymentKey({
        accessToken: userToken.data.access_token,
        gatewayPaymentKey: userData.gatewayPaymentKey,
        password: '1231234',
        username: 'chteste'
      })
      expect(result.status).toEqual(200)
    })
  })
})
