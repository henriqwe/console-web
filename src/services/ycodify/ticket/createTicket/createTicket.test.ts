import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createTicket } from '.'
import * as services from 'services'
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

describe('createTicket function', () => {
  it('should create ticket', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await createTicket({
        category: 'fakeCategory',
        content: 'fakeContent',
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss.ms'),
        project: 'chester',
        status: 'fakeStatus',
        title: 'fakeTitle',
        userid: userData.data.id
      })
      expect(result.status).toEqual(200)
    })
  })
})
