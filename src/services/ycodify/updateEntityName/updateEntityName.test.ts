import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import * as services from 'services'
import { updateEntityName } from '.'

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

describe('updateEntityName function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await updateEntityName({
        accessToken: userData.data.access_token,
        Name: 'fakeEntity',
        projectName: 'chester',
        selectedEntity: 'fakeEntity'
      })
      expect(result.status).toEqual(200)
    })
  })
})
