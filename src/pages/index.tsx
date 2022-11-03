import * as dashboard from 'domains/dashboard'
import { Tour } from 'domains/dashboard/Tour'
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
        <title>Projects - Dashboard</title>
      </Head>
      <Tour />
      <dashboard.Template>
        <dashboard.Projects />
      </dashboard.Template>
    </>
  )
}

// Admin user name: tester@test

// Admin password: xl75BQUEjkgMZVrp
