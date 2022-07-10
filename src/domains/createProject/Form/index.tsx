import * as common from 'common'
import * as createProject from 'domains/createProject'

export function Form() {
  const { selectedPlan, currentPage } = createProject.useCreateProject()
  return (
    <section className="flex flex-col w-full gap-5 p-10 px-20">
      <div>
        <p>Project type:</p>
        <p className="text-lg font-bold">{selectedPlan}</p>
      </div>

      <common.Breadcrumb
        pages={[
          { name: 'Create project', current: currentPage === 'FORM' },
          { name: 'Set up admin user', current: currentPage === 'USER' }
        ]}
        showNumber
      />

      {currentPage === 'FORM' ? (
        <createProject.CreateSchema />
      ) : (
        <createProject.CreateAdminUser />
      )}
    </section>
  )
}
