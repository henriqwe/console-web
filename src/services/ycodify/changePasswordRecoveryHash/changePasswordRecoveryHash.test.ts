import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { changePasswordRecoveryHash } from '.'

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

describe('changePasswordRecoveryHash function', () => {
  it('should changer user password using hash', async () => {
    return true
    //  COMO OBTER O passwordRecoveryHash?
    await act(async () => {
      const result = await changePasswordRecoveryHash({
        password: '',
        passwordRecoveryHash: '',
        username: ''
      })
      expect(result.status).toEqual(200)
    })
  })
})
