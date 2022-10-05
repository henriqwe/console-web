import * as common from 'common'
import * as utils from 'utils'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'
import { CheckIcon } from '@heroicons/react/outline'
import * as dashboard from 'domains/dashboard'
import { Icon } from '@iconify/react'

export function ViewAdminUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { createdSchemaName, adminUser } = dashboard.useData()

  async function Submit() {
    try {
      router.push(routes.console + '/' + createdSchemaName)
    } catch (err: any) {
      console.log(err)
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <common.Card>
      <common.Alert title="Attention" theme="warning">
        Please save the admin user password as it cannot be recovered.
      </common.Alert>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center w-full gap-2">
          <div>
            <Icon icon="fa-solid:user-cog" className="w-40 h-40" />
          </div>
          <p className="text-lg">Admin account created</p>
          <div className="flex flex-col justify-end w-full">
            <p className="text-sm text-gray-600">
              Admin username:{' '}
              <span className="font-bold">{adminUser?.username}</span>
            </p>
            <p className="text-sm text-gray-600">
              Admin password:{' '}
              <span className="font-bold">{adminUser?.password}</span>
            </p>
            <p className="text-sm text-gray-600">
              X-TenantAC:{' '}
              <span className="font-bold">{utils.getCookie('X-TenantAC')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end w-full">
          <div className="flex gap-4">
            <common.Buttons.WhiteOutline
              loading={loading}
              disabled={loading}
              onClick={Submit}
              icon={<CheckIcon className="w-4 h-4" />}
            >
              Conclude
            </common.Buttons.WhiteOutline>
          </div>
        </div>
      </div>
    </common.Card>
  )
}
