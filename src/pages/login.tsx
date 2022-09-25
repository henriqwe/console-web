import * as login from 'domains/login'

export default function Login() {
  return (
    <login.LoginProvider>
      <Page />
    </login.LoginProvider>
  )
}

function Page() {
  const { formType } = login.useLogin()
  return (
    <>
      <login.AuthLayout>
        {formType === 'login' ? <login.LogUser /> : <login.CreateUser />}
      </login.AuthLayout>
    </>
  )
}
