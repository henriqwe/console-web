import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getTicketMessages } from '.'

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

describe('getTicketMessages function', () => {
  it('should get ticket messages data', async () => {
    await act(async () => {
      const result = await getTicketMessages({
        ticketid: 1
      })
      expect(result.status).toEqual(200)
    })
  })
})
