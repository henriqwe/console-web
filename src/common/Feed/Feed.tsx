import { UserIcon } from '@heroicons/react/outline'
import { ChatAltIcon } from '@heroicons/react/solid'
import * as utils from 'utils'
type FeedProps = {
  activity: {
    id: number | string
    content: string
    date: string
    name: string
  }[]
}
export function Feed({ activity }: FeedProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id}>
            <div className="relative pb-8">
              {activityItemIdx !== activity.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-300"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full ring-4 ring-gray-200 dark:ring-bg-page">
                    <UserIcon
                      className="w-8 h-8 text-slate-400 dark:text-bg-page"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="absolute -bottom-0.5 -right-1 rounded-tl rounded-br-full bg-gray-200 dark:bg-bg-page px-0.5 py-px">
                    <ChatAltIcon
                      className="w-5 h-5 text-gray-400 dark:text-gray-100"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {activityItem.name}
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {new Date(activityItem.date).toLocaleString('pt-br')}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-50">
                    <p>{activityItem.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
