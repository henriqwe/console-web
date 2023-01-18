import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { runInterpreter } from '.'
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

describe('runInterpreter function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const { data: schemaData } = await services.ycodify.getSchema({
        accessToken: userToken.data.access_token,
        name: 'chester'
      })
      const result = await runInterpreter({
        accessToken: userToken.data.access_token,
        data: `{
          "action": "READ",
          "data": [
            {
              "asdasd": {}
            }
          ]
        }`,
        XTenantAC: schemaData.tenantAc,
        XTenantID: schemaData.tenantId
      })
      expect(result.status).toEqual(200)
    })
  })
})
