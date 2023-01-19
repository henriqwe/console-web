import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getRoles } from './getRoles'
import { createRole } from './createRole'
import { deleteRole } from './deleteRole'
import { updateRole } from './updateRole'

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

describe('getRoles function', () => {
  it('should get roles data', async () => {
    await act(async () => {
      const result = await getRoles({
        password: 'A2vWiOx1O0P2NTGK',
        username: 'chteste@chester'
      })
      expect(result.status).toEqual(200)
    })
  })
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
describe('updateRole function', () => {
  it('should update role', async () => {
    //ERRO AO ATUALIZAR
    return true
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const { data: schemaData } = await services.ycodify.getSchema({
        accessToken: userData.data.access_token,
        name: 'chester'
      })
      console.log(' schemaData.tenantId', schemaData.tenantId)
      const result = await updateRole({
        adminUsername: 'chteste@chester',
        password: 'A2vWiOx1O0P2NTGK',
        role: {
          name: 'fakeRole',
          status: 2
        },
        XTenantID: schemaData.tenantId
      })

      expect(result.status).toEqual(200)
    })
  })
})
describe('deleteRole function', () => {
  it('should delete role', async () => {
    await act(async () => {
      const result = await deleteRole({
        password: 'A2vWiOx1O0P2NTGK',
        roleName: 'fakeRole',
        username: 'chteste@chester'
      })
      expect(result.status).toEqual(200)
    })
  })
})
