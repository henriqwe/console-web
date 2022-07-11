import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api`
})

const localApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`
})

export { api, localApi }
