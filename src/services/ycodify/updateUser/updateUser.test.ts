import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateUser } from '.'
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

describe('updateUser function', () => {
  it('should updata userData', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const { data: schemaData } = await services.ycodify.getSchema({
        accessToken: userToken.data.access_token,
        name: 'chester'
      })
      const result = await updateUser({
        adminUsername: 'chteste@chester',
        password: 'A2vWiOx1O0P2NTGK',
        roles: [],
        status: 1,
        username: 'fakeUser',
        XTenantID: schemaData.tenantId
      })
      expect(result.status).toEqual(201)
    })
  })
})
