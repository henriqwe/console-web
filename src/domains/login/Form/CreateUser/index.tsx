import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import {
  useForm,
  FieldValues,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { routes } from 'domains/routes'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { signIn } from 'next-auth/react'
import { usePixel } from 'contexts/PixelContext'

type formDataType = {
  name: string
  userName: string
  password: string
  email: string
}

export function CreateUser() {
  const { pixel } = usePixel()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required('Name is required'),
        userName: yup
          .string()
          .required('Username is required')
          .test('equal', 'This field cannot contain spaces', (val) => {
            const validation = new RegExp(/\s/g)
            return !validation.test(val as string)
          })
          .test('equal', 'This field must contain only letters', (val) => {
            const validation = new RegExp(/^[A-Za-z ]*$/)
            return validation.test(val as string)
          }),
        email: yup
          .string()
          .email('Email must be valid')
          .required('Email is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters long')
      })
    )
  })

  async function Submit(formData: formDataType) {
    try {
      setLoading(true)
      //create customer pagarme
      const { data: pagarme_customer } = await utils.localApi.post(
        utils.apiRoutes.local.pagarme.customers.create,
        {
          name: formData.name,
          email: formData.email,
          username: formData.userName
        }
      )
      // create user ycodify
      await utils.localApi.post(utils.apiRoutes.local.createAccount, {
        name: formData.name,
        username: formData.userName,
        password: formData.password,
        email: formData.email
      })
      // get user ycodify token
      const { data: userData } = await utils.localApi.post(
        utils.apiRoutes.local.getUserToken,
        {
          username: formData.userName,
          password: formData.password
        }
      )

      // update user ycodify with gatewayPaymentKey
      await utils.api.post(
        utils.apiRoutes.updateAccount,
        {
          username: formData.userName,
          password: formData.password,
          gatewayPaymentKey: pagarme_customer?.id as string
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: userData?.access_token as string
          }
        }
      )

      const res = await signIn('credentials', {
        username: formData.userName,
        password: formData.password,
        redirect: false
      })

      if (res?.ok && res?.status === 200) {
        pixel.track('Lead')
        await handleActiveCampaign(formData)
        return router.push(routes.dashboard)
      }
      // utils.setCookie('access_token', data?.data?.access_token)
      utils.notification('User created successfully', 'success')
      router.push(routes.dashboard)
    } catch (err: any) {
      if (err?.response?.status === 417) {
        return utils.notification('Username already exists', 'error')
      }
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
      className="flex flex-col mt-10 gap-y-8"
    >
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex flex-col w-full gap-y-2">
            <common.Input
              onChange={onChange}
              label="Name"
              placeholder="Full name"
              name="name"
              type="text"
              errors={errors.name}
            />
          </div>
        )}
      />
      <Controller
        name="userName"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex flex-col w-full gap-y-2">
            <common.Input
              onChange={onChange}
              label="Username"
              placeholder="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              errors={errors.userName}
            />
          </div>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex flex-col w-full gap-y-2">
            <common.Input
              onChange={onChange}
              label="E-mail"
              placeholder="E-mail"
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              errors={errors.email}
            />
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex flex-col w-full gap-y-2">
            <common.Input
              onChange={onChange}
              label="Password"
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              errors={errors.password}
            />
          </div>
        )}
      />

      <common.Buttons.Ycodify
        className="w-full md:w-max md:self-end"
        type="submit"
        loading={loading}
        disabled={loading}
        icon={<ArrowRightIcon className="w-5 h-5 text-white" />}
      >
        Register
      </common.Buttons.Ycodify>
    </form>
  )
}

async function handleActiveCampaign(formData: formDataType) {
  const acFormData = new FormData()

  const acSubdomain = process.env.NEXT_PUBLIC_AC_SUBDOMAIN as string
  const acOr = '0c786ae5a473977fe713c5b91a961217'
  const acListId = '5'

  acFormData.append('u', acListId)
  acFormData.append('f', acListId)
  acFormData.append('s', 's')
  acFormData.append('c', '0')
  acFormData.append('m', '0')
  acFormData.append('act', 'sub')
  acFormData.append('v', '2')
  acFormData.append('or', acOr)

  acFormData.append('firstname', formData.userName)
  acFormData.append('email', formData.email)

  await fetch(acSubdomain, {
    method: 'POST',
    body: acFormData,
    mode: 'no-cors'
  })
}
