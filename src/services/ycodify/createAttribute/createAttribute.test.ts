import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createAttribute } from '.'
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

describe('createAttribute function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await createAttribute({
        accessToken: userData.data.access_token,
        ColumnName: 'fakeColumn',
        Comment: '',
        entityName: 'fakeEntity',
        Length: '64',
        Nullable: true,
        projectName: 'chester',
        Type: 'Text'
      })
      expect(result.status).toEqual(201)
    })
  })
})
