import { ChevronRightIcon, ReplyIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

import { routes } from 'domains/routes'

export function Header() {
  const router = useRouter()

  return (
    <div className="flex w-full bg-gray-800 h-16 gap-4">
      <div className="flex w-[20%] h-full border-r border-gray-400 items-center px-6">
        <img
          className="w-auto h-7"
          src="/assets/images/logo.png"
          alt="Workflow"
        />
      </div>
      <div className="flex flex-col h-full justify-center text-gray-300 -space-y-1">
        <div className="flex gap-2 items-center">
          <p className="text-xs  leading-none">Dashboard</p>
          <div
            className="flex items-center gap-1 bg-gray-600 rounded-sm px-1 text-super-tiny text-gray-300 cursor-pointer hover:bg-gray-600 hover:text-gray-200"
            onClick={() => {
              router.push(routes.dashboard)
            }}
          >
            <ReplyIcon className="w-2 h-2" />
            <span>Back</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-3xl font-semi-bold  leading-none ">
            {router.query.name}
          </span>
        </div>
      </div>
    </div>
  )
}
