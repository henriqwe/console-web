import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getParser } from '.'
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

describe('getParser function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await getParser({
        accessToken: userData.data.access_token,
        name: 'teste'
      })
      expect(result.status).toEqual(200)
    })
  })
})
