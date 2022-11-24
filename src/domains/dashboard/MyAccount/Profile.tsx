import React, { useState } from 'react'
import * as Common from 'common'
import * as utils from 'utils'
import { useUser } from 'contexts/UserContext'
import { ChevronRightIcon } from '@heroicons/react/solid'

type formProps = {
  myInfo: {
    username: string
    email: string
    oldPassword: string
    password: string
    passwordConfirmation: string
  }
  address: {
    addrStreet: string
    addrNumber: string
    addrCountry: string
    addrDistrict: string
    addrCity: string
    addrZip: string
  }
}

export function Profile() {
  const { user } = useUser()
  const {
    username,
    email,
    addrStreet,
    addrNumber,
    addrCountry,
    addrDistrict,
    addrCity,
    addrZip,
    status
  } = user?.userData || {}
  //form e setform devem vir do contexto do dashboard, os valores iniciais são de um request usando a senha na hora do login
  const [form, setForm] = useState<formProps>({
    myInfo: {
      username,
      email,
      oldPassword: '',
      password: '',
      passwordConfirmation: ''
    },
    address: {
      addrStreet,
      addrNumber,
      addrCountry,
      addrDistrict,
      addrCity,
      addrZip
    }
  })

  const [loading, setLoading] = useState(false)

  function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    if (form.myInfo.password !== form.myInfo.passwordConfirmation) {
      utils.notification("The passwords don't match", 'error')
      setLoading(false)
      return
    }

    if (form.myInfo.password.length < 6 || form.myInfo.oldPassword.length < 6) {
      utils.notification(
        'The password must have at least 6 characters',
        'error'
      )
      setLoading(false)
      return
    }

    utils.api
      .post(
        utils.apiRoutes.changePassword,
        {
          username,
          password: form.myInfo.password,
          oldPassword: form.myInfo.oldPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        if (res.status === 200) {
          utils.notification('Password changed successfully!', 'success')
        } else utils.notification(res.data.message, 'error')
      })
      .then(() => setLoading(false))
  }

  return (
    <div className="grid w-full grid-cols-1 gap-y-10">
      <form
        onSubmit={(e) => handleChangePassword(e)}
        className="flex flex-col px-4 gap-y-4 "
      >
        <p className="text-xl dark:text-text-primary">My Info</p>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-4 h-full">
            <Common.Input
              placeholder="Username"
              label="Username"
              type="text"
              disabled
              value={form.myInfo.username}
            />
            <Common.Input
              placeholder="Email"
              label="Email"
              type="email"
              disabled
              value={form.myInfo.email}
            />
          </div>
          <div className="flex flex-col gap-y-4 h-full">
            <Common.Input
              placeholder="Old Password"
              label="Old Password"
              type="password"
              onChange={(e) =>
                setForm({
                  ...form,
                  myInfo: { ...form.myInfo, oldPassword: e.target.value }
                })
              }
              value={form.myInfo.oldPassword}
            />
            <Common.Input
              placeholder="New Password"
              label="New Password"
              type="password"
              onChange={(e) =>
                setForm({
                  ...form,
                  myInfo: { ...form.myInfo, password: e.target.value }
                })
              }
              value={form.myInfo.password}
            />
            <Common.Input
              placeholder="Password Confirmation"
              label="Password Confirmation"
              type="password"
              onChange={(e) =>
                setForm({
                  ...form,
                  myInfo: {
                    ...form.myInfo,
                    passwordConfirmation: e.target.value
                  }
                })
              }
              value={form.myInfo.passwordConfirmation}
            />
          </div>
        </div>
        <span className="flex self-end mt-auto px-3 lg:col-start-2">
          <Common.Buttons.Ycodify
            icon={
              loading ? (
                <Common.Spinner className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )
            }
            className="w-max"
            type="submit"
          >
            Change Password
          </Common.Buttons.Ycodify>
        </span>
      </form>
    </div>
  )
}
