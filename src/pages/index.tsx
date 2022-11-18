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
        <title>Projects - Dashboard</title>
      </Head>
      <dashboard.Template>
        <dashboard.Projects />
      </dashboard.Template>
    </>
  )
}
