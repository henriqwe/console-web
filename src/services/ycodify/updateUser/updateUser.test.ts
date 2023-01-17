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
  return true
  it('should create association', async () => {
    const userData = await services.ycodify.getUserToken({
      password: '1231234',
      username: 'chteste'
    })
    await act(async () => {
      const result = await updateUser({
        accessToken: userData.data.access_token,
        Comment: '',
        name: 'fakeassociation',
        type: 'asdasd',
        Nullable: false,
        projectName: 'chester',
        selectedEntity: 'asdasd'
      })
      expect(result.status).toEqual(201)
    })
  })
})
