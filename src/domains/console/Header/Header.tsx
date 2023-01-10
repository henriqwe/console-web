import { ReplyIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'
import { ToggleTheme } from 'common'
import { BetaTag } from 'common/BetaTag'

export function Header() {
  const router = useRouter()

  return (
    <div>
      <div className="flex w-full h-16 gap-4 bg-gray-800">
        <div className="flex w-[20%] justify-between h-full border-r border-gray-400 dark:border-gray-700 items-center px-6">
          <div className="flex w-max gap-x-4">
            <img
              className="w-auto h-6"
              src="/assets/images/logoTextLight.png"
              alt="Workflow"
            />
            <BetaTag />
          </div>
          <ToggleTheme changeColor={false} />
        </div>
        <div className="flex flex-col justify-center h-full text-gray-300 gap-y-1">
          <div className="z-20 flex items-center gap-2">
            <p className="text-xs leading-none">Dashboard</p>
            <div
              className="flex items-center gap-1 px-1 text-gray-300 bg-gray-600 rounded-sm cursor-pointer text-super-tiny hover:bg-gray-600 hover:text-gray-200"
              onClick={() => {
                router.push(routes.dashboard)
              }}
            >
              <ReplyIcon className="w-2 h-2" />
              <span>Back</span>
            </div>
          </div>
          <div className="flex items-center ">
            <span className="text-xl font-bold leading-none">
              {router.query.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
