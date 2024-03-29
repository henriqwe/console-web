import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { customersCreate } from '.'

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

describe('customersCreate function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const result = await customersCreate({
        name: 'John Doe',
        email: 'john@doe.com',
        username: 'JohnDoe'
      })
      expect(result.status).toEqual(200)
      expect(result.config.data).toEqual(
        '{"name":"John Doe","email":"john@doe.com","username":"JohnDoe"}'
      )
    })
  })
})
