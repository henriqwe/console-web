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
    <div className="w-full h-[100vh] bg-gray-300 flex justify-center items-center">
      {formType === 'login' ? <login.LogUser /> : <login.CreateUser />}
    </div>
  )
}
