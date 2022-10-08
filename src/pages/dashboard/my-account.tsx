import * as dashboard from 'domains/dashboard'
import Head from 'next/head'

export default function Dashboard() {
  return (
    <dashboard.DataProvider>
      <Page />
    </dashboard.DataProvider>
  )
}

function Page() {
  return (
    <>
      <Head>
        <title>My Account - Dashboard</title>
      </Head>
      <dashboard.Template>
        <dashboard.MyAccount />
      </dashboard.Template>
    </>
  )
}

// Admin user name: tester@test

// Admin password: xl75BQUEjkgMZVrp
