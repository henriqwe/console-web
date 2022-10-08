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
        <title>Tutorials & Docs - Dashboard</title>
      </Head>
      <dashboard.Template>
        <dashboard.TutorialsAndDocs />
      </dashboard.Template>
    </>
  )
}

// Admin user name: tester@test

// Admin password: xl75BQUEjkgMZVrp
