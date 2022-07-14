import * as common from 'common'
import * as utils from 'utils'
import * as createProject from 'domains/createProject'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'
import { UserCircleIcon } from '@heroicons/react/solid'

export function ViewAdminUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { createdSchemaName, adminUser } = createProject.useCreateProject()

  async function Submit() {
    try {
      setLoading(true)

      const { data } = await utils.localApi.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/adminLogin`,
        {
          username: adminUser?.username,
          password: adminUser?.password
        }
      )
      utils.setCookie('admin_access_token', data.data.access_token)
      utils.setCookie('X-TenantID', data.data.username)

      utils.notification(`Project concluded successfully`, 'success')
      router.push(routes.console + '/' + createdSchemaName)
    } catch (err: any) {
      console.log(err)
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <common.Card className="p-6 bg-white">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center w-full gap-5">
          <div className="w-40 h-40">
            <UserCircleIcon />
          </div>
          <p className="text-lg">Admin account created!</p>
          <div>
            <p className="text-sm text-gray-600">
              Admin user name:{' '}
              <span className="font-bold">{adminUser?.username}</span>
            </p>
            <p className="text-sm text-gray-600">
              Admin password:{' '}
              <span className="font-bold">{adminUser?.password}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end w-full">
          <div className="flex gap-4">
            <common.Button
              loading={loading}
              disabled={loading}
              onClick={Submit}
            >
              Conclude
            </common.Button>
          </div>
        </div>
      </div>
    </common.Card>
  )
}
