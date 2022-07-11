import * as common from 'common'
import * as createProject from 'domains/createProject'
import { routes } from 'domains/routes'
import { useRouter } from 'next/router'

export function Form() {
  const { selectedPlan, currentPage } = createProject.useCreateProject()
  const router = useRouter()

  return (
    <section className="flex flex-col w-full gap-5 p-10 px-20">
      <div>
        <p>Project type:</p>
        <p className="text-lg font-bold">{selectedPlan}</p>
      </div>

      <div className="flex w-full items-center justify-between">
        <common.Breadcrumb
          pages={[
            { name: 'Create project', current: currentPage === 'FORM' },
            { name: 'Set up admin user', current: currentPage === 'USER' }
          ]}
          showNumber
        />
        <common.Button
          type="button"
          onClick={() => {
            router.push(routes.dashboard)
          }}
          color="red-outline"
        >
          <p>Cancel</p>
        </common.Button>
      </div>

      {currentPage === 'FORM' ? (
        <createProject.CreateSchema />
      ) : (
        <createProject.CreateAdminUser />
      )}
    </section>
  )
}
