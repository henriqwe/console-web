import * as utils from 'utils'
import { PlusIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import axios from 'axios'

export function Roles() {
  async function getRoles() {
    const { data } = await axios.get(
      `https://api.ycodify.com/api/caccount/account`,
      {
        headers: {
          Authorization: `Bearer ${utils.getCookie('access_token')}`,
          Accept: 'application/json'
        }
      }
    )
    console.log(data)
  }

  useEffect(() => {
    getRoles()
  }, [])

  return (
    <section className="flex-1 p-6">
      <div className="h-full border-2 border-gray-300 rounded-lg">
        <div className="flex items-center justify-between w-full p-2 bg-gray-200 ring-1 ring-gray-300">
          <p className="text-lg">Roles</p>
          <button className="px-3 py-2 bg-green-400 rounded-lg">
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
