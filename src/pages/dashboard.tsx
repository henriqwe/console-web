import * as dashboard from 'domains/dashboard'

export default function Dashboard() {
  return <Page />
}

function Page() {
  return (
    <dashboard.Template>
      <dashboard.Projects />
    </dashboard.Template>
  )
}
