import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateAttribute } from '.'
import * as services from 'services'

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

describe('createEntitySchema function', () => {
  it('should get user password', async () => {
    await act(async () => {
      return true
      const userData = await services.ycodify.getUserToken({
        password: '1231234',
        username: 'chteste'
      })
      const result = await updateAttribute({
        accessToken: userData.data.access_token,
        entityName: '',
        formData: '',
        name: '',
        projectName: 'chester'
      })
      expect(result.status).toEqual(200)
      expect(result.config.data).toEqual(
        '{"username":"chteste","password":"1231234","oldPassword":"1231234"}'
      )
    })
  })
})
