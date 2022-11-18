import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/`
})

const localApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`
})

const apiPagarme = axios.create({
  baseURL: `${process.env.PAGARME_API_URL}/`
})

export { api, localApi, apiPagarme }
