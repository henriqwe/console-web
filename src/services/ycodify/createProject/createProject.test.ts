import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createProject } from '.'

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

describe('createProject function', () => {
  it('should changer user password', async () => {
    await act(async () => {
      const result = await createProject({
        email: '123123',
        name: '123123',
        password: '123123',
        username: 'chteste'
      })
      expect(result.status).toEqual(200)
    })
  })
})
