import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getUserToken } from '.'

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

describe('getUserToken function', () => {
  it('should get user token', async () => {
    await act(async () => {
      const result = await getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      expect(result.status).toEqual(200)
      expect(result.config.data).toEqual(
        'username=chteste&password=1231234&grant_type=password'
      )
      expect(typeof result.data.access_token).toBe('string')
    })
  })
})
