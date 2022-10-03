import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import * as UserContext from 'contexts/UserContext'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'

export function AdminLogin() {
  const router = useRouter()

  const { user, setUser } = UserContext.useUser()
  const [loading, setLoading] = useState(false)
  const { setRoles, setOpenSlide } = consoleData.useUser()
  const { control, handleSubmit, reset } = useForm()

  async function onSubmit(formData: { Password: string }) {
    console.log('formData', formData)
    try {
      if (!formData.Password) {
        throw new Error('Please enter a password')
      }
      const { data } = await utils.api.post(
        utils.apiRoutes.roles,
        {
          username: `${
            utils.parseJwt(utils.getCookie('access_token'))?.username
          }@${router.query.name}`,
          password: formData.Password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log()
      setRoles(data)
      setUser({ ...user, adminSchemaPassword: formData.Password })
      reset()
      utils.notification('Authorized', 'success')
      setOpenSlide(false)
    } catch (error) {
      utils.showError(error)
      setUser({ ...user, adminSchemaPassword: undefined })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col p-4 gap-4 ">
      <div className="flex flex-col">
        <span className="font-semibold">Username</span>
        {`${utils.parseJwt(utils.getCookie('access_token'))?.username}@${
          router.query.name
        }`}
      </div>
      <Controller
        name={'Password'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="w-full">
            <common.Input
              placeholder={'Password'}
              label="Password"
              value={value}
              onChange={onChange}
            />
          </div>
        )}
      />
      <div className="flex justify-end">
        <common.Buttons.WhiteOutline
          disabled={loading}
          loading={loading}
          type="button"
          onClick={() => handleSubmit(onSubmit)()}
          icon={<CheckIcon className="w-3 h-3" />}
        >
          access
        </common.Buttons.WhiteOutline>
      </div>
    </form>
  )
}
