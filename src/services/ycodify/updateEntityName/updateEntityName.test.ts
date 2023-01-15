import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateEntityName } from '.'

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

describe('updateEntityName function', () => {
  return true
  it('should changer user password', async () => {
    await act(async () => {
      const result = await updateEntityName({
        password: 'A2vWiOx1O0P2NTGK',
        username: 'chteste@chester'
      })
      expect(result.status).toEqual(200)
    })
  })
})
