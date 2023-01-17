import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createTicketMessage } from '.'

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

describe('createTicketMessage function', () => {
  return true
  it('should changer user password', async () => {
    await act(async () => {
      const result = await createTicketMessage({
        password: 'A2vWiOx1O0P2NTGK',
        username: 'chteste@chester'
      })
      expect(result.status).toEqual(200)
    })
  })
})
