import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from 'axios'
import * as consoleData from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'

export function Update() {
  const [loading, setLoading] = useState(false)
  const {
    setOpenSlide,
    setReload,
    reload,
    selectedTable,
    selectedItemToExclude,
    tableFields
  } = consoleData.useData()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (formData: any) => {
    setLoading(true)
    await axios
      .post(
        `http://localhost:3000/api/interpreter`,
        {
          data: JSON.parse(
            `{\n 
              "action":"UPDATE",\n 
              "object":{\n 
                "classUID": "${selectedTable}",\n 
                "id": ${selectedItemToExclude.id},\n 
                "role": "ROLE_ADMIN",\n 
                ${tableFields
                  .filter((field) => field !== 'id')
                  .map(
                    (field, index) =>
                      `"${field}":"${formData[field]}"${
                        index !== tableFields.length - 2 ? ',' : ''
                      }\n`
                  )
                  .join('')}
              }\n
            }`
          )
        },
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      .then(() => {
        reset()
        setReload(!reload)
        setOpenSlide(false)
        setLoading(false)
        utils.notification('Operation performed successfully', 'success')
      })
      .catch((err) => {
        utils.notification(err.message, 'error')
      })
  }

  // useEffect(() => {
  //   reset({
  //     Nome: slidePanelState.data?.Nome || '',
  //     Descricao: slidePanelState.data?.Descricao || ''
  //   })
  // }, [slidePanelState.data, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        {tableFields
          .filter((field) => field !== 'id')
          .map((field) => (
            <Controller
              name={field}
              key={field}
              defaultValue={selectedItemToExclude[field]}
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex-1">
                  <common.Input
                    placeholder={field}
                    value={value}
                    onChange={onChange}
                    errors={errors.Name}
                  />
                </div>
              )}
            />
          ))}
      </div>
      <common.Separator />
      <common.Button disabled={loading} loading={loading}>
        <div className="flex">Update</div>
      </common.Button>
    </form>
  )
}
