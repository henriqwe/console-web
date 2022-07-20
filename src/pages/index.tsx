import * as dashboard from 'domains/dashboard'

export default function Dashboard() {
  return (
    <dashboard.DataProvider>
      <Page />
    </dashboard.DataProvider>
  )
}

function Page() {
  return (
    <dashboard.Template>
      <dashboard.Projects />
    </dashboard.Template>
  )
}
