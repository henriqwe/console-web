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
  const { currentSection } = dashboard.useData()

  let component = <div />
  let pageTitle = ''

  switch (currentSection) {
    case 'projects':
      component = <dashboard.Projects />
      pageTitle = 'Projects - Dashboard'
      break
    case 'helpAndSupport':
      component = <dashboard.HelpAndSupport />
      pageTitle = 'Help & Support - Dashboard'
      break
    case 'tutorialsAndDocs':
      component = <dashboard.TutorialsAndDocs />
      pageTitle = 'Tutorials & Docs - Dashboard'
      break
    case 'myAccount':
      component = <dashboard.MyAccount />
      pageTitle = 'My Account - Dashboard'
      break
  }
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <dashboard.Template>{component}</dashboard.Template>)
    </>
  )
}

// Admin user name: tester@test

// Admin password: xl75BQUEjkgMZVrp
