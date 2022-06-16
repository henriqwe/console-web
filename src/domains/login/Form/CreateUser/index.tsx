import axios from 'axios'
import * as common from 'common'
import * as utils from 'utils'
import * as login from 'domains/login'
import {
  useForm,
  FieldValues,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useState } from 'react'

export function CreateUser() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setFormType, createUserSchema } = login.useLogin()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(createUserSchema) })

  async function Submit(formData: {
    userName: string
    password: string
    email: string
  }) {
    setLoading(true)
    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/createAccount',
        {
          username: formData.userName,
          password: formData.password,
          email: formData.email
        }
      )
      utils.setCookie('access_key', data.data.access_token)
      utils.notification('Usuário criado com sucesso', 'success')
      router.push('/')
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col items-center w-1/3 bg-white rounded-lg"
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
    >
      <div className="flex flex-col items-center w-full px-6 pt-6 bg-white rounded-lg">
        <div className="flex flex-col items-center mb-10">
          <img src="logoTextDark.png" alt="Logo" className="w-80" />
          <p>Web console</p>
        </div>

        <p className="text-gray-700">Faça aqui seu cadastro</p>
        <div className="flex flex-col w-full gap-4 my-4">
          <Controller
            name="userName"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="w-full">
                <common.Input
                  placeholder="Nome de usuário"
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
            name="email"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="w-full">
                <common.Input
                  placeholder="Email"
                  className="w-full"
                  onChange={onChange}
                  type="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
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
                  placeholder="Senha"
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
            Cadastrar
          </common.Button>
        </div>
      </div>

      <div className="w-full border" />
      <p className="py-3 text-gray-700">
        Possui uma conta?{' '}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setFormType('login')}
        >
          Faça o login!
        </span>
      </p>
    </form>
  )
}
