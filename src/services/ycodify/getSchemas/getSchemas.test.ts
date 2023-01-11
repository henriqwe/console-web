import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getSchemas } from '.'
import * as services from 'services'
jest.mock('utils/api', () => {
  const axios = require('axios')

  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  return {
    api
  }
})

describe('getSchemas function', () => {
  it('should get user data', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await getSchemas({
        accessToken: userData.data.access_token
      })

      expect(result.status).toEqual(200)
    })
  })
})
