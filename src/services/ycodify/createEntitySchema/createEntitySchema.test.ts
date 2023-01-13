import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createEntitySchema } from '.'
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

describe('createEntitySchema function', () => {
  it('should create a schema entity', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await createEntitySchema({
        accessToken: userData.data.access_token,
        attributes: [
          {
            name: 'fakename',
            type: 'String',
            comment: '',
            nullable: false,
            length: 0
          }
        ],
        entityName: 'chester',
        name: 'fakeentity'
      })
      expect(result.status).toEqual(201)
    })
  })
})
