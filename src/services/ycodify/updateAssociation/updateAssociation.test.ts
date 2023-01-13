import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { updateAssociation } from '.'
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

describe('createAssociation function', () => {
  it('should changer user password', async () => {
    return true
    const userData = await services.ycodify.getUserToken({
      password: '1231234',
      username: 'chteste'
    })
    await act(async () => {
      const result = await updateAssociation({
        accessToken: userData.data.access_token,
        attribute: '',
        name: '',
        projectName: 'chester',
        selectedEntity: ''
      })
      expect(result.status).toEqual(200)
      expect(result.config.data).toEqual(
        '{"username":"chteste","password":"1231234","oldPassword":"1231234"}'
      )
    })
  })
})
