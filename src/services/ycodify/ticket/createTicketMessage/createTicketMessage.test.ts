import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createTicketMessage } from '.'
import { format } from 'date-fns'

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
  it('should changer user password', async () => {
    await act(async () => {
      const result = await createTicketMessage({
        content: 'fake content',
        createdbyuser: true,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss.ms'),
        ticket: 1,
        ticketid: 1
      })
      expect(result.status).toEqual(200)
    })
  })
})
