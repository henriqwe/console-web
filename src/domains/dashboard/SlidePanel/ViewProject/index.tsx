import { useForm } from 'react-hook-form'
import { useState } from 'react'
import * as dashboard from 'domains/dashboard'
import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import CopyToClipboard from 'react-copy-to-clipboard'
import { DocumentDuplicateIcon } from '@heroicons/react/outline'

type AdminUser = {
  name: string
  roles: []
  status: number
  username: string
  version: number
}

export function ViewSchema() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { setOpenSlide, selectedSchema, setSelectedSchema, reload, setReload } =
    dashboard.useData()
  const [adminUser, setAdminUser] = useState<AdminUser>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [showCopyText, setShowCopyText] = useState(false)

  const yupSchema = yup.object().shape({ Name: yup.string().required() })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(yupSchema) })

  const onSubmit = async (formData: any) => {
    try {
      setLoading(true)
      // await axios.put(
      //   `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
      //   {
      //     name: formData.Name
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${utils.getCookie('access_token')}`
      //     }
      //   }
      // )

      // reset()
      // setSelectedTable(formData.Name)
      // setReload(!reload)
      setOpenSlide(false)
      setLoading(false)
      utils.notification('Operation performed successfully', 'success')
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  async function DeleteProject() {
    try {
      setSubmitLoading(true)
      await utils.api.delete(
        `${utils.apiRoutes.schemas}/${selectedSchema?.name}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setReload(!reload)
      setSelectedSchema(undefined)
      setOpenSlide(false)
      setOpenModal(false)
      utils.notification(
        `Project ${selectedSchema?.name} deleted successfully`,
        'success'
      )
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  // async function loadAdminUser() {
  //   try {
  //     const { data } = await utils.api.get(utils.apiRoutes.adminData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${utils.getCookie('admin_access_token')}`,
  //         'X-TenantID': utils.getCookie('X-TenantID') as string
  //       }
  //     })
  //     setAdminUser(data[0])
  //   } catch (err: any) {
  //     utils.notification(err.message, 'error')
  //   }
  // }

  // useEffect(() => {
  //   loadAdminUser()
  // }, [])

  return (
    <div
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex justify-between w-full">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Project plan
          </p>
          <p className="font-bold dark:text-gray-300">Sandbox</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Created at:
          </p>
          <p className="text-sm dark:text-gray-300">
            {new Date(selectedSchema?.createdat as number).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Status:</p>
          <p className="text-sm dark:text-gray-300">{selectedSchema?.status}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Project secret:
          </p>
          <div className="flex w-full">
            <input
              value={selectedSchema?.tenantAc}
              disabled
              type="password"
              className="w-40 text-xs bg-transparent dark:text-gray-300"
            />
            <CopyToClipboard
              text="Copy to clipboard"
              onCopy={() => {
                setShowCopyText(true)
                setTimeout(() => {
                  setShowCopyText(false)
                }, 800)
              }}
            >
              <div className="flex items-center">
                <DocumentDuplicateIcon
                  className="w-5 h-5 text-gray-700 cursor-pointer dark:text-gray-300"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      selectedSchema?.tenantAc as string
                    )
                  }
                />
              </div>
            </CopyToClipboard>
          </div>
          {showCopyText && <span className="dark:text-gray-400">Copied!</span>}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Admin user</p>
          <p className="font-bold dark:text-gray-300">
            {adminUser ? adminUser.username : `tester@${selectedSchema?.name}`}
          </p>
        </div>
      </div>

      <div className="w-full my-2">
        <common.Separator />
      </div>
      <div className="flex justify-end w-full">
        <common.Buttons.RedOutline
          disabled={loading}
          loading={loading}
          onClick={() => {
            setOpenModal(true)
          }}
        >
          <p className="flex">Delete schema</p>
        </common.Buttons.RedOutline>
        {/* <common.Buttons.Blue disabled={loading} loading={loading}>
          <div className="flex">Update admin password</div>
        </common.Buttons.Blue> */}
      </div>

      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        loading={submitLoading}
        disabled={submitLoading}
        title={`Remove ${selectedSchema} project?`}
        description={
          <>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to remove this project?{' '}
            </p>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
              this action is irreversible!!!
            </p>
          </>
        }
        buttonTitle="Remove project"
        handleSubmit={DeleteProject}
      />
    </div>
  )
}
