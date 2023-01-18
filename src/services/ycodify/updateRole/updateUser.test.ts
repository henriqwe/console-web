import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateRole } from '.'
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

describe('updateRole function', () => {
  it('should update role', async () => {
    const userData = await services.ycodify.getUserToken({
      password: '1231234',
      username: 'chteste'
    })
    const { data: schemaData } = await services.ycodify.getSchema({
      accessToken: userData.data.access_token,
      name: 'chester'
    })
    await act(async () => {
      const result = await updateRole({
        adminUsername: 'chteste@chester',
        password: 'A2vWiOx1O0P2NTGK',
        role: {
          name: 'fakeRole',
          status: 1
        },
        XTenantID: schemaData.tenantId
      })
      expect(result.status).toEqual(200)
    })
  })
})
