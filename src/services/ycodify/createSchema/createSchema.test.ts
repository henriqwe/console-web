import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createSchema } from '.'

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

describe('createSchema function', () => {
  return true
  it('should changer user password', async () => {
    await act(async () => {
      const result = await createSchema({
        email: '123123',
        name: '123123',
        password: '123123',
        username: 'chteste'
      })
      expect(result.status).toEqual(200)
    })
  })
})
