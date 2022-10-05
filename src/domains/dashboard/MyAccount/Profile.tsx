import React, { useState } from 'react'
import * as Common from 'common'
import { ChevronRightIcon } from '@heroicons/react/solid'

type formProps = {
  myInfo: {
    email: string
    password: string
    passwordConfirmation: string
  }
  address: {
    address: string
    country: string
    state: string
    city: string
    zip: string
  }
}

export function Profile() {
  //form e setform devem vir do contexto do dashboard, os valores iniciais são de um request usando a senha na hora do login
  const [form, setForm] = useState<formProps>({
    myInfo: {
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    address: {
      address: '',
      country: '',
      state: '',
      city: '',
      zip: ''
    }
  })

  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    console.log(form)
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="grid grid-cols-1 md:grid-cols-2 gap-y-10 w-full"
    >
      {/* os valores padrão dos campos usuário (username, email) e endereço vêm da página de login, usando a senha que o usuário coloca para logar, e  */}
      <div className="flex flex-col gap-y-4 px-4">
        <p className="dark:text-text-primary text-xl">My Info</p>
        <Common.Input label="Username" className="w-full" readOnly value={''} />
        <div className="flex flex-col gap-y-4">
          <Common.Input
            placeholder="Email"
            label="Email"
            type="email"
            className="w-full"
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
            className="w-full"
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
            className="w-full"
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
      <div className="flex flex-col gap-y-4 px-4">
        <p className="dark:text-text-primary text-xl">Address</p>
        <div className="flex flex-col gap-y-4">
          <Common.Input
            placeholder="Street and number"
            label="Street and number"
            className="w-full"
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, address: e.target.value }
              })
            }
            value={form.address.address}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4">
            <Common.Input
              placeholder="Country"
              label="Country"
              className="w-full"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, country: e.target.value }
                })
              }
              value={form.address.country}
            />
            <Common.Input
              placeholder="State"
              label="State"
              className="w-full"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, state: e.target.value }
                })
              }
              value={form.address.state}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 w-full justify-evenly gap-y-4">
            <Common.Input
              placeholder="City"
              label="City"
              className="w-full"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, city: e.target.value }
                })
              }
              value={form.address.city}
            />
            <Common.Input
              placeholder="Zip code"
              label="Zip code"
              className="w-full"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, zip: e.target.value }
                })
              }
              value={form.address.zip}
            />
          </div>
        </div>
      </div>
      <span className="flex justify-end lg:col-start-2 px-3">
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
