import { XIcon } from '@heroicons/react/outline'
import * as common from 'common'
import * as createProject from 'domains/createProject'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

export function Header() {
  const { currentPage } = createProject.useCreateProject()
  const router = useRouter()
  return (
    <div className="flex items-center justify-between w-full p-2 bg-white">
      <div className="w-48">
        <img src="/assets/images/logoTextDark.png" alt="Logo" />
      </div>

      {currentPage === 'PLANS' && (
        <common.Button
          color="red"
          className="w-8 h-8 rounded-lg"
          onClick={() => {
            router.push(routes.dashboard)
          }}
          type="button"
        >
          <XIcon className="min-h-[2rem] text-white min-w-[2rem]" />
        </common.Button>
      )}
    </div>
  )
}
