import React, { useState } from 'react'
import * as Common from 'common'
import * as utils from 'utils'
import { useUser } from 'contexts/UserContext'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'

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
  const { data: session } = useSession()
  const { user, setUser } = useUser()
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

  async function getUserData() {
    const { data } = await utils.api.get(utils.apiRoutes.userData, {
      headers: {
        Authorization: session?.accessToken as string
      }
    })

    return data
  }

  const refreshUserData = async () => {
    getUserData().then((userData) => setUser((prev) => ({ ...prev, userData })))
  }

  function handleUpdateAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    utils.api
      .post(
        utils.apiRoutes.updateAccount,
        {
          username,
          email: form.myInfo.email,
          status,
          addrStreet: form.address.addrStreet,
          addrNumber: form.address.addrNumber,
          addrCountry: form.address.addrCountry,
          addrDistrict: form.address.addrDistrict,
          addrCity: form.address.addrCity,
          addrZip: form.address.addrZip
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: session?.accessToken as string
          }
        }
      )
      .then((res) => {
        if (res.status === 200) {
          refreshUserData()

          utils.notification('Address updated successfully!', 'success')
        } else utils.notification(res.data.message, 'error')
      })
      .then(() => setLoading(false))
  }

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
    <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-y-10">
      <form
        onSubmit={(e) => handleChangePassword(e)}
        className="flex flex-col px-4 gap-y-4"
      >
        <p className="text-xl dark:text-text-primary">My Info</p>
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
                myInfo: { ...form.myInfo, passwordConfirmation: e.target.value }
              })
            }
            value={form.myInfo.passwordConfirmation}
          />
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
      <form
        onSubmit={(e) => handleUpdateAddress(e)}
        className="flex flex-col px-4 gap-y-4"
      >
        <p className="text-xl dark:text-text-primary">Address</p>
        <div className="flex flex-col gap-y-4 h-full">
          <div className="flex flex-col col-span-1 xl:grid xl:grid-cols-4 gap-y-4 gap-x-2">
            <Common.Input
              placeholder="Street"
              label="Street"
              className="col-span-1 sm:col-span-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, addrStreet: e.target.value }
                })
              }
              value={form.address.addrStreet}
            />
            <Common.Input
              placeholder="Number"
              label="Number"
              className="col-span-3 sm:col-span-1"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, addrNumber: e.target.value }
                })
              }
              value={form.address.addrNumber}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4">
            <Common.Input
              placeholder="Country"
              label="Country"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, addrCountry: e.target.value }
                })
              }
              value={form.address.addrCountry}
            />
            <Common.Input
              placeholder="State"
              label="State"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, addrDistrict: e.target.value }
                })
              }
              value={form.address.addrDistrict}
            />
          </div>

          <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-x-2 justify-evenly gap-y-4">
            <Common.Input
              placeholder="City"
              label="City"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, addrCity: e.target.value }
                })
              }
              value={form.address.addrCity}
            />
            <Common.Input
              placeholder="Zip code"
              label="Zip code"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, addrZip: e.target.value }
                })
              }
              value={form.address.addrZip}
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
            Update Address
          </Common.Buttons.Ycodify>
        </span>
      </form>
    </div>
  )
}
