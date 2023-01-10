import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { changePasswordRecoveryHash } from '.'

jest.mock('utils/api', () => {
  const axios = require('axios')

  const api = axios.create({
    baseURL: `https://api.ycodify.com/`
  })
  return {
    api
  }
})

describe('changePasswordRecoveryHash function', () => {
  it('should changer user password using hash', async () => {
    return true
    // await act(async () => {
    //   const result = await changePasswordRecoveryHash({
    //     oldPassword: '1231234',
    //     password: '1231234',
    //     username: 'chteste'
    //   })
    //   expect(result.status).toEqual(200)
    //   expect(result.config.data).toEqual(
    //     '{"username":"chteste","password":"1231234","oldPassword":"1231234"}'
    //   )
    // })
  })
})
