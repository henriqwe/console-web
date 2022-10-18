import * as login from 'domains/login'

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
      <login.ChangePassword />
    </login.AuthLayout>
  )
}
