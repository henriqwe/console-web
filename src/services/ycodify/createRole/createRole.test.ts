import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createRole } from '.'
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

describe('createRole function', () => {
  it('should create a role', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const { data: schemaData } = await services.ycodify.getSchema({
        accessToken: userToken.data.access_token,
        name: 'chester'
      })
      const result = await createRole({
        Name: 'fakeRole',
        Status: 1,
        XTenantID: schemaData.tenantId,
        password: 'A2vWiOx1O0P2NTGK',
        username: 'chteste@chester'
      })
      expect(result.status).toEqual(200)
    })
  })
})
