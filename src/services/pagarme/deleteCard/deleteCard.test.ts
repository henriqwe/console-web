import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { deleteCard } from '.'
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

describe('deleteCard function', () => {
  it('should delete a card', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const userData = await services.ycodify.getUserData({
        accessToken: userToken.data.access_token
      })
      const { data: customersCards } = await services.pagarme.getCustomersCards(
        {
          gatewayPaymentKey: userData.gatewayPaymentKey
        }
      )
      const result = await deleteCard({
        cardId: customersCards?.[0]?.id,
        customerId: userData.gatewayPaymentKey
      })
      expect(result.status).toEqual(200)
    })
  })
})
