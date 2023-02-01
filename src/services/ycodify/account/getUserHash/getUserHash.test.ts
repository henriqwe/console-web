import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { getUserHash } from '.'

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

describe('getUserHash function', () => {
  it('should get user hash', async () => {
    await act(async () => {
      const result = await getUserHash({
        userName: 'chteste'
      })
      expect(result.status).toEqual(200)
    })
  })
})
