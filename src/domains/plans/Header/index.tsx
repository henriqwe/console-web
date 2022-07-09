import { XIcon } from '@heroicons/react/outline'
import * as common from 'common'
import { useRouter } from 'next/router'

export function Header() {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between w-full p-2 bg-white">
      <div className="w-48">
        <img src="/assets/images/logoTextDark.png" alt="Logo" />
      </div>

      <common.Button
        color="red"
        className="w-8 h-8 rounded-lg"
        onClick={() => {
          router.push('/')
        }}
        type="button"
      >
        <XIcon className="min-h-[2rem] text-white min-w-[2rem]" />
      </common.Button>
    </div>
  )
}
