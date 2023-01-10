import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createAccount } from '.'

jest.mock('utils/api', () => {
  const axios = require('axios')

  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  return {
    api
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
      expect(result.data).toEqual(
        '{"username":"chteste","password":"1231234","oldPassword":"1231234"}'
      )
    })
  })
})
