import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { deleteSchema } from '.'
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

describe('deleteSchema function', () => {
  it('should delete a schema', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await deleteSchema({
        accessToken: userToken.data.access_token,
        selectedSchema: 'fakeSchema'
      })
      expect(result.status).toEqual(200)
    })
  })
})
