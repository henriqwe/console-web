import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateAccountAndRole } from '.'

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

describe('updateAccountAndRole function', () => {
  it('should updata account and role', async () => {
    await act(async () => {
      const result = await updateAccountAndRole({
        roles: [],
        usernameAdmin: 'chteste@chester',
        password: 'A2vWiOx1O0P2NTGK',
        username: 'fakeUser'
      })
      expect(result.status).toEqual(200)
    })
  })
})
