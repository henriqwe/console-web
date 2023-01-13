import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { createCard } from '.'

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

describe('createCard function', () => {
  it('should create a credit card in pagarme', async () => {
    await act(async () => {
      const result = await createCard({
        brand: 'Visa',
        city: 'Maceió',
        country: 'BR',
        customerId: 'cus_EvM50rLHzjFeozWq',
        cvv: '123',
        exp_month: '12',
        exp_year: '28',
        holder_name: 'CLAUDIO',
        line_1: '105, Rua são caetano',
        number: '4000000000000010',
        state: 'AL',
        zip_code: '57084079'
      })
      expect(result.status).toEqual(200)
    })
  })
})
