import * as dashboard from 'domains/dashboard'
import * as creditCardContext from 'domains/dashboard/MyAccount/Cards/CreditCardContext'

import Head from 'next/head'

export default function Dashboard() {
  return (
    <dashboard.DataProvider>
      <creditCardContext.DataProvider>
        <Page />
      </creditCardContext.DataProvider>
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
