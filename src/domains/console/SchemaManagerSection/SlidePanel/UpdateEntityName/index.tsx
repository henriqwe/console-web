import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import * as consoleData from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { CheckIcon } from '@heroicons/react/outline'

export function UpdateEntityName() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { setOpenSlide, setReload, reload, selectedEntity, setSelectedEntity } =
    consoleData.useSchemaManager()

  const yupSchema = yup.object().shape({
    Name: yup
      .string()
      .required('Entity name is required')
      .test('equal', 'Entity name must contain only letters', (val) => {
        const validation = new RegExp(/^[A-Za-z ]*$/)
        return validation.test(val as string)
      })
      .test('equal', 'Entity name cannot contain spaces', (val) => {
        const validation = new RegExp(/\s/g)
        return !validation.test(val as string)
      })
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(yupSchema) })

  const onSubmit = async (formData: any) => {
    try {
      setLoading(true)
      await utils.api.put(
        `${utils.apiRoutes.entity(
          router.query.name as string
        )}/${selectedEntity}`,
        {
          name: formData.Name,
          _conf: {}
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      reset()
      setSelectedEntity(formData.Name)
      setReload(!reload)
      setOpenSlide(false)
      setLoading(false)
      utils.notification('Operation performed successfully', 'success')
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          name="Name"
          defaultValue={selectedEntity}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="w-full flex flex-col gap-y-2">
              <common.Input
                placeholder="field name"
                value={value}
                onChange={onChange}
              />
              {errors.Name && (
                <p className="text-sm text-red-500">{errors.Name.message}</p>
              )}
            </div>
          )}
        />
      </div>
      <common.Separator />
      <common.Buttons.WhiteOutline
        type="submit"
        disabled={loading}
        loading={loading}
        icon={<CheckIcon className="w-3 h-3" />}
      >
        Update
      </common.Buttons.WhiteOutline>
    </form>
  )
}
