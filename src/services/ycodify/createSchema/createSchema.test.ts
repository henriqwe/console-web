import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createSchema } from '.'
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

describe('createSchema function', () => {
  it('should create a schema', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await createSchema({
        accessToken: userToken.data.access_token,
        projectName: 'chester'
      })
      expect(result.status).toEqual(200)
    })
  })
})
