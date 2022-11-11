import { TourProvider } from '@reactour/tour'
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
    <TourProvider
      steps={[]}
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': '#0cd664',
          borderRadius: 10
        }),
        dot: (base, { current }: any) => ({
          ...base,
          backgroundColor: current ? '#0cd664' : '#ccc'
        })
      }}
      beforeClose={() =>
        window.localStorage.setItem('toured-dashboard', 'true')
      }
    >
      <Head>
        <title>Projects - Dashboard</title>
      </Head>
      <Tour />
      <dashboard.Template>
        <dashboard.Projects />
      </dashboard.Template>
    </TourProvider>
  )
}

// Admin user name: tester@test

// Admin password: xl75BQUEjkgMZVrp
