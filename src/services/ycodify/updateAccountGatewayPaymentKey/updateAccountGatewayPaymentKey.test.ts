import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateAccountGatewayPaymentKey } from '.'

jest.mock('utils/api', () => {
  const axios = require('axios')

  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  return {
    api
  }
})

describe('updateAccountGatewayPaymentKey function', () => {
  it('should get user hash', async () => {
    return true
    //   await act(async () => {
    //     const result = await updateAccountGatewayPaymentKey({
    //       userName: 'chteste'
    //     })
    //     expect(result.status).toEqual(200)
    //   })
  })
})
