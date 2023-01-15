import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import * as consoleData from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import * as services from 'services'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCookie } from 'utils/cookies'

export function Update() {
  const [loading, setLoading] = useState(false)
  const {
    setOpenSlide,
    setReload,
    reload,
    selectedEntity,
    selectedItemToExclude,
    entityData
  } = consoleData.useSchemaManager()

  let schemaShape = {}

  for (const field of entityData!.filter((field) => field.name !== 'id')) {
    let yupValidation
    switch (field.type) {
      case 'String':
        yupValidation = field.isNullable
          ? yup.string()
          : yup.string().required()
        break
      case 'Integer':
      case 'Long':
      case 'Double':
      case 'Timestamp':
        yupValidation = field.isNullable
          ? yup.number().typeError('Value must be a number')
          : yup.number().required().typeError('Value must be a number')
        break
      case 'Boolean':
        yupValidation = field.isNullable
          ? yup.object()
          : yup.object().required()
        break
    }

    schemaShape = {
      ...schemaShape,
      [field.name]: yupValidation
    }
  }

  const yupSchema = yup.object().shape(schemaShape)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(yupSchema) })

  const onSubmit = async (formData: any) => {
    try {
      await services.ycodify.runInterpreter({
        accessToken: getCookie('admin_access_token') as string,
        data: JSON.parse(
          `{\n 
            "action":"UPDATE",\n 
            "object":{\n 
              "classUID": "${selectedEntity}",\n 
              "id": ${selectedItemToExclude.id},\n 
              "role": "ROLE_ADMIN",\n 
              ${entityData
                ?.filter((field) => field.name !== 'id')
                .map(
                  (field, index) =>
                    `"${field.name}":"${
                      field.type === 'Boolean'
                        ? formData[field.name].key
                        : formData[field.name]
                    }"${index !== entityData?.length - 2 ? ',' : ''}\n`
                )
                .join('')}
            }\n
          }`
        ),
        XTenantAC: getCookie('X-TenantAC') as string,
        XTenantID: getCookie('X-TenantID') as string
      })

      reset()
      setReload(!reload)
      setOpenSlide(false)
      setLoading(false)
      utils.notification('Operation performed successfully', 'success')
    } catch (err) {
      utils.showError(err)
    }
    setLoading(true)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        {entityData
          ?.filter((field) => field.name !== 'id')
          .map((field) => (
            <Controller
              name={field.name}
              key={field.name}
              defaultValue={selectedItemToExclude[field.name]}
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex-1">
                  {field.type === 'Boolean' ? (
                    <common.Select
                      onChange={onChange}
                      value={value}
                      options={[
                        { name: 'True', value: true },
                        { name: 'False', value: false }
                      ]}
                      errors={errors[field.name]}
                    />
                  ) : (
                    <common.Input
                      placeholder={field.name}
                      label={field.name}
                      value={value}
                      onChange={onChange}
                      errors={errors[field.name]}
                      type={
                        field.type === 'Integer' ||
                        field.type === 'Long' ||
                        field.type === 'Double' ||
                        field.type === 'Timestamp'
                          ? 'number'
                          : 'text'
                      }
                    />
                  )}
                </div>
              )}
            />
          ))}
      </div>
      <common.Separator />
      <common.Buttons.Blue disabled={loading} loading={loading}>
        <div className="flex">Update</div>
      </common.Buttons.Blue>
    </form>
  )
}
