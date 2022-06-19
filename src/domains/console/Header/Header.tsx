import { UserIcon } from '@heroicons/react/outline'
import { Icon } from '@iconify/react'

export function Header() {
  return (
    <div className="flex items-center justify-between w-full h-24">
      <p className="px-4 text-2xl font-bold text-gray-700">Academia</p>

      <div className="flex gap-2">
        <button className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-[0.65rem] text-gray-400 hover:bg-gray-200 hover:text-blue-400 transition">
          <UserIcon className="w-5 h-5 " />
        </button>
        <button className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-[0.65rem] text-gray-400 hover:bg-gray-200 hover:text-blue-400 transition">
          <Icon icon="vscode-icons:file-type-config" className={`w-5 h-5`} />
        </button>
      </div>
    </div>
  )
}
