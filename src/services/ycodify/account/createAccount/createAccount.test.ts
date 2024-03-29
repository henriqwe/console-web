import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createAccount } from '.'

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

describe('createAccount function', () => {
  it('should create a user account', async () => {
    await act(async () => {
      const result = await createAccount({
        email: 'fakeUser@fakeemail.com',
        name: 'Fake User',
        password: '123123',
        username: 'fakeUser'
      })
      expect(result.status).toEqual(200)
    })
  })
})
