import React, { useState } from 'react'
import * as Common from 'common'
import { useUser } from 'contexts/UserContext'
import { ChevronRightIcon } from '@heroicons/react/solid'

type formProps = {
  myInfo: {
    username: string
    email: string
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
    addrZip
  } = user?.userData
  //form e setform devem vir do contexto do dashboard, os valores iniciais são de um request usando a senha na hora do login
  const [form, setForm] = useState<formProps>({
    myInfo: {
      username,
      email,
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    setLoading(false)
  }

  // useEffect(() => {
  //   console.log(user)
  // }, [])

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="grid w-full grid-cols-1 md:grid-cols-2 gap-y-10"
    >
      {/* os valores padrão dos campos usuário (username, email) e endereço vêm da página de login, usando a senha que o usuário coloca para logar, e  */}
      <div className="flex flex-col px-4 gap-y-4">
        <p className="text-xl dark:text-text-primary">My Info</p>
        <div className="flex flex-col gap-y-4">
          <Common.Input
            label="Username"
            disabled
            value={form.myInfo.username}
          />
          <Common.Input
            placeholder="Email"
            label="Email"
            type="email"
            onChange={(e) =>
              setForm({
                ...form,
                myInfo: { ...form.myInfo, email: e.target.value }
              })
            }
            value={form.myInfo.email}
          />
          <Common.Input
            placeholder="Password"
            label="Password"
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
      </div>
      <div className="flex flex-col px-4 gap-y-4">
        <p className="text-xl dark:text-text-primary">Address</p>
        <div className="flex flex-col gap-y-4">
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
              value={form.address.addrCity}
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
      </div>
      <span className="flex justify-end px-3 lg:col-start-2">
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
          Update data
        </Common.Buttons.Ycodify>
      </span>
    </form>
  )
}
