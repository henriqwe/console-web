import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { changePassword } from './changePassword'

jest.mock('utils/api', () => {
  const axios = require('axios')

  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  return {
    api
  }
})

describe('changePassword function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const result = await changePassword({
        oldPassword: '123123',
        password: '123123',
        username: 'chteste'
      })
      expect(result.status).toEqual(200)
      expect(result.config.data).toEqual(
        '{"username":"chteste","password":"123123","oldPassword":"123123"}'
      )
    })
  })
})
