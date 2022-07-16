import * as common from 'common'
import * as dataContext from 'domains/console'
import { UserIcon } from '@heroicons/react/outline'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import axios from 'axios'
import * as utils from 'utils'
import {
  useForm,
  FieldValues,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { routes } from 'domains/routes'

export function Header() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const { setCurrentTab } = dataContext.useData()
  const { logUserSchema } = dataContext.useUser()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(logUserSchema) })

  async function Submit(formData: { userName: string; password: string }) {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/adminLogin`,
        {
          username: formData.userName,
          password: formData.password
        }
      )
      utils.setCookie('admin_access_token', data.data.access_token)
      utils.setCookie('X-TenantID', data.data.username)
      utils.notification('Login successfully', 'success')
      setOpenModal(false)
      setCurrentTab('USERS')
    } catch (err: any) {
      if (err.response.status === 401) {
        return utils.notification(
          'Ops! Incorrect username or password',
          'error'
        )
      }
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className='flex my-0 gap-4 items-end py-4'>
        <p className="text-3xl font-semi-bold text-gray-900">{router.query.name}</p>
      </div>
      {/* <div className="flex gap-2">
        <button
          className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-[0.65rem] text-gray-400 hover:bg-gray-200 hover:text-blue-400 transition"
          title="Manage Application Accounts and Roles"
          onClick={() => {
            if (!utils.getCookie('admin_access_token')) {
              setOpenModal(true)
              return
            }
            setCurrentTab('USERS')
          }}
        >
          <UserIcon className="w-5 h-5 " />
        </button>
        <button className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-[0.65rem] text-gray-400 hover:bg-gray-200 hover:text-blue-400 transition">
          <Icon icon="vscode-icons:file-type-config" className={`w-5 h-5`} />
        </button>
      </div> */}
      {/* <common.ClearModal open={openModal} setOpen={setOpenModal}>
        <form
          onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
          className="p-6"
        >
          <p className="text-center">
            This section requires the admin account to be enabled.
          </p>
          <div className="flex flex-col w-full gap-4 my-4">
            <Controller
              name="userName"
              control={control}
              render={({ field: { onChange } }) => (
                <div className="w-full">
                  <common.Input
                    placeholder="User name"
                    className="w-full"
                    onChange={onChange}
                  />
                  {errors.userName && (
                    <p className="text-sm text-red-500">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange } }) => (
                <div className="w-full">
                  <common.Input
                    placeholder="Password"
                    type="password"
                    className="w-full"
                    onChange={onChange}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
            />
            <common.Button type="submit" loading={loading} disabled={loading}>
              Entrar
            </common.Button>
          </div>
        </form>
      </common.ClearModal> */}
    </div>
  )
}
