import { UserIcon } from '@heroicons/react/outline'
import { ChatAltIcon } from '@heroicons/react/solid'
import * as utils from 'utils'
type FeedProps = {
  activity: {
    id: number | string
    content: string
    date: string
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-8 ring-gray-200 dark:ring-bg-page">
                    <UserIcon
                      className="h-8 w-8 text-slate-400 dark:text-bg-page"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-gray-200 dark:bg-bg-page px-0.5 py-px">
                    <ChatAltIcon
                      className="h-5 w-5 text-gray-400 dark:text-gray-100"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Username
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {activityItem.date}
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
