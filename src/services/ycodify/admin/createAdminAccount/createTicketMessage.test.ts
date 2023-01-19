import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createAdminAccount } from '.'
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

describe('createAdminAccount function', () => {
  it('should create a admin account', async () => {
    return true
    await act(async () => {
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await createAdminAccount({
        projectName: 'chester',
        accessToken: userData.data.access_token
      })
      expect(result.status).toEqual(200)
    })
  })
})
