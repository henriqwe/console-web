import * as common from 'common'
import { PlusIcon, SearchIcon } from '@heroicons/react/outline'

export function Projects() {
  return (
    <div className="py-6">
      <section className="flex justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex">
          <h1 className="pr-4 mr-4 text-2xl font-semibold text-gray-900 border-r border-r-gray-300">
            Projects
          </h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg bg-[#B1C900]">
              <PlusIcon className="w-5 h-5 text-white" />
            </button>
            <p className="text-lg">New Project</p>
          </div>
        </div>
        <div className="flex">
          <common.Input
            placeholder="Search Projects..."
            className="rounded-r-none"
          />
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg"
          >
            <SearchIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </section>
      <section className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <div className="border-4 border-gray-200 border-dashed rounded-lg h-96" />
        </div>
        {/* /End replace */}
      </section>
    </div>
  )
}
