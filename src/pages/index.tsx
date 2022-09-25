import * as dashboard from 'domains/dashboard'

export default function Dashboard() {
  return (
    <dashboard.DataProvider>
      <Page />
    </dashboard.DataProvider>
  )
}

function Page() {
  const { currentSection } = dashboard.useData()

  let component = <div />
  switch (currentSection) {
    case 'projects':
      component = <dashboard.Projects />
      break
    case 'helpAndSupport':
      component = <dashboard.HelpAndSupport />
      break
    case 'tutorialsAndDocs':
      break
    case 'myAccount':
      break
  }
  return (
    <dashboard.Template>
      {component}
    </dashboard.Template>
  )
}

// Admin user name: tester@test

// Admin password: xl75BQUEjkgMZVrp
