import * as login from 'domains/login'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Login() {
  return (
    <login.LoginProvider>
      <Page />
    </login.LoginProvider>
  )
}

function Page() {
  return (
    <login.AuthLayout>
      <login.LogUser />
    </login.AuthLayout>
  )
}
