import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createSchema } from './createSchema'
import { updatePublishSchema } from './updatePublishSchema'
import { deleteSchema } from './deleteSchema'
import { getParser } from './getParser'
import { getSchema } from './getSchema'
import { getSchemas } from './getSchemas'
import { runInterpreter } from './runInterpreter'

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
function makeProjectName(length: number) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const projectName = makeProjectName(7)

describe('createSchema function', () => {
  it('should create a schema', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await createSchema({
        accessToken: userToken.data.access_token,
        projectName: projectName
      })
      expect(result.status).toEqual(201)
    })
  })
})

describe('updatePublishSchema function', () => {
  it('should update schema status', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await updatePublishSchema({
        accessToken: userData.data.access_token,
        name: projectName,
        status: 1
      })
      expect(result.status).toEqual(200)
      expect(result.config.data).toEqual('{"status":1}')
    })
  })
})

describe('getParser function', () => {
  it('should get schema parser', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await getParser({
        accessToken: userData.data.access_token,
        name: projectName
      })
      expect(result.status).toEqual(200)
    })
  })
})

describe('getSchema function', () => {
  it('should get a schema', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await getSchema({
        accessToken: userData.data.access_token,
        name: projectName
      })
      expect(result.status).toEqual(200)
    })
  })
})

describe('runInterpreter function', () => {
  it('should run interpreter', async () => {
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

describe('deleteSchema function', () => {
  it('should delete a schema', async () => {
    await act(async () => {
      const userToken = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await deleteSchema({
        accessToken: userToken.data.access_token,
        selectedSchema: projectName
      })
      expect(result.status).toEqual(200)
    })
  })
})
