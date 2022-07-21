import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from 'axios'
import * as dashboard from 'domains/dashboard'
import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

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
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function DeleteProject() {
    try {
      setSubmitLoading(true)
      await axios.delete(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${selectedSchema}`,
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
        `Project ${selectedSchema} deleted successfully`,
        'success'
      )
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  async function loadAdminUser() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/caccount/account`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('admin_access_token')}`,
            'X-TenantID': utils.getCookie('X-TenantID') as string
          }
        }
      )
      setAdminUser(data[0])
    } catch (err: any) {
      utils.notification(err.message, 'error')
    }
  }

  useEffect(() => {
    loadAdminUser()
  }, [])

  return (
    <div
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex justify-between w-full">
        <div>
          <p className="text-sm text-gray-600">Projetc plan</p>
          <p className="font-bold">Sandbox</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Admin user</p>
          <p className="font-bold">
            {adminUser ? adminUser.username : `tester@$${selectedSchema}`}
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
          <div className="flex">Delete schema</div>
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
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this project?{' '}
            </p>
            <p className="text-sm font-bold text-gray-600">
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
