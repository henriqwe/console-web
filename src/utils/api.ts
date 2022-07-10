import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.ycodify.com/api'
})

const localApi = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export {
  api,
  localApi
}
