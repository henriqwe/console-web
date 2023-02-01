import * as common from 'common'
import * as utils from 'utils'
import { ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'
import {
  CheckIcon,
  DocumentDuplicateIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/outline'
import * as dashboard from 'domains/dashboard'
import CopyToClipboard from 'react-copy-to-clipboard'

export function ViewAdminUser() {
  const router = useRouter()
  const [allowConclude, setAllowConclude] = useState(false)
  const [loading, setLoading] = useState(false)
  const { createdSchemaName, adminUser } = dashboard.useData()

  function Submit() {
    setLoading(true)
    try {
      router.push(routes.console + '/' + createdSchemaName)
    } catch (err: any) {
      // console.log(err)
      utils.notification(err.message, 'error')
      setLoading(false)
    }
  }

  return (
    <common.Card className="flex flex-col gap-4">
      <common.Alert title="Attention" theme="warning">
        Please save the admin user password as it cannot be recovered.
      </common.Alert>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center w-full gap-4">
          <div className="w-40 h-40 mt-4">
            <common.illustrations.User />
          </div>
          <p className="text-lg text-slate-700 dark:text-gray-200">
            Admin account created
          </p>
          <div className="flex flex-col justify-end w-full gap-4">
            <InfoDetails
              Icon={
                <UserCircleIcon className="w-5 h-5 text-gray-200 dark:text-slate-800" />
              }
              title={'Admin username'}
              description={
                <div className="flex items-center gap-1">
                  <p>{adminUser?.username as string}</p>
                  <CopyToClipboard text="Copy to clipboard">
                    <div>
                      <DocumentDuplicateIcon
                        className="w-5 h-5 text-gray-700 cursor-pointer dark:text-text-tertiary"
                        data-testid="username"
                        onClick={() => {
                          utils.notification('Copied to clipboard', 'success')
                          navigator.clipboard.writeText(
                            adminUser?.username as string
                          )
                        }}
                      />
                    </div>
                  </CopyToClipboard>
                </div>
              }
            />
            <InfoDetails
              Icon={
                <KeyIcon className="w-5 h-5 text-gray-200 dark:text-slate-800" />
              }
              title={'Admin password'}
              description={
                <div className="flex items-center gap-1">
                  <input
                    disabled
                    value={adminUser?.password as string}
                    type="password"
                    className="w-20 text-xs truncate bg-transparent dark:text-text-tertiary"
                  />
                  <CopyToClipboard text="Copy to clipboard">
                    <div>
                      <DocumentDuplicateIcon
                        className="w-5 h-5 text-gray-700 cursor-pointer dark:text-text-tertiary"
                        data-testid="password"
                        onClick={() => {
                          utils.notification('Copied to clipboard', 'success')
                          navigator.clipboard.writeText(
                            adminUser?.password as string
                          )
                        }}
                      />
                    </div>
                  </CopyToClipboard>
                </div>
              }
            />
            <InfoDetails
              Icon={
                <ShieldCheckIcon className="w-5 h-5 text-gray-200 dark:text-slate-800" />
              }
              title={'X-TenantAC'}
              description={utils.getCookie('X-TenantAC') as string}
            />
          </div>
        </div>

        <common.Separator />
        <div className="flex w-full gap-x-2">
          <input
            type="checkbox"
            role="checkbox"
            className="w-5 h-5"
            onChange={() => {
              setAllowConclude(!allowConclude)
            }}
            id="checkbox"
          />
          <label className="text-sm" htmlFor="checkbox">
            I understand that I need to save the admin password as it will not
            be displayed again.
          </label>
        </div>

        <div className="flex items-center justify-end w-full">
          <div className="flex gap-4">
            <common.Buttons.WhiteOutline
              loading={loading}
              disabled={loading || !allowConclude}
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

function InfoDetails({
  Icon,
  title,
  description
}: {
  Icon: ReactNode
  title: string
  description: ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-100">
        <div>{Icon}</div>
      </div>

      <div className="flex flex-col">
        <span className="text-sm dark:text-gray-300">{title}</span>
        <span className="text-gray-500 dark:text-gray-200">{description}</span>
      </div>
    </div>
  )
}
