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

export function LogUser() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setFormType, logUserSchema } = login.useLogin()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(logUserSchema) })

  async function Submit(formData: { userName: string; password: string }) {
    setLoading(true)
    try {
      const { data } = await axios.post('http://localhost:3000/api/login', {
        username: formData.userName,
        password: formData.password
      })
      utils.setCookie('access_token', data.data.access_token)
      utils.notification('Login realizado com sucesso', 'success')
      router.push('/')
    } catch (err: any) {
      if (err.response.status === 401) {
        return utils.notification('Ops! Usuário ou senha incorretos', 'error')
      }
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
          <img
            src="/assets/images/logoTextDark.png"
            alt="Logo"
            className="w-80"
          />
          <p>Web console</p>
        </div>

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
            Entrar
          </common.Button>
        </div>
      </div>

      <div className="w-full border" />
      <p className="py-3 text-gray-700">
        Não possui uma conta?{' '}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setFormType('create')}
        >
          Cadastre-se!
        </span>
      </p>
    </form>
  )
}
