import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createAccount } from '.'

jest.mock('utils/api', () => {
  const axios = require('axios')

  const localApi = axios.create({
    baseURL: `http://localhost:3000`
  })
  return {
    localApi
  }
})

describe('createAccount function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const result = await createAccount({
        email: '123123',
        name: '123123',
        password: '123123',
        username: 'chteste'
      })
      expect(result.status).toEqual(200)
    })
  })
})
