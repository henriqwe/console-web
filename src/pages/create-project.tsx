import * as createProject from 'domains/createProject'

export default function Plans() {
  return (
    <createProject.CreateProjectProvider>
      <Page />
    </createProject.CreateProjectProvider>
  )
}

function Page() {
  const { currentPage } = createProject.useCreateProject()
  let page = <div />
  switch (currentPage) {
    case 'PLANS':
      page = <createProject.Plans />
      break
    case 'FORM':
    case 'USER':
      page = <createProject.Form />
      break
  }
  return (
    <createProject.Template>
      {page}
    </createProject.Template>
  )
}
