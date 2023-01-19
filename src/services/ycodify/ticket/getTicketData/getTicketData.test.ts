import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getTicketData } from '.'

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

describe('getTicketData function', () => {
  it('should get ticket data', async () => {
    await act(async () => {
      const result = await getTicketData({
        ticket: {}
      })
      expect(result.status).toEqual(200)
    })
  })
})
