import * as yup from 'yup'
import * as utils from 'utils'
import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleData from 'domains/console'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  useForm,
  Controller,
  FieldValues,
  SubmitHandler
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

type FormData = {
  Name: string
}

export function FieldDetail({
  attribute,
  schemaTables,
  setShowDetails
}: {
  attribute: string
  schemaTables?: types.SchemaTable
  setShowDetails: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const { selectedEntity, setReload, reload } = consoleData.useSchemaManager()

  const {
    formState: { errors },
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        Name: yup.string().required()
      })
    )
  })

  async function Save(formData: FormData) {
    try {
      await utils.api.put(
        `${utils.apiRoutes.association({
          projectName: router.query.name as string,
          entityName: selectedEntity as string
        })}/${attribute}`,
        {
          name: formData.Name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setReload(!reload)
      utils.notification('Attribute updated successfully', 'success')
      setShowDetails(false)
    } catch (err) {
      utils.showError(err)
    }
  }

  async function Remove() {
    try {
      await utils.api.delete(
        `${utils.apiRoutes.association({
          projectName: router.query.name as string,
          entityName: selectedEntity as string
        })}/${attribute}/type/${
          schemaTables![selectedEntity as string][attribute].type
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setReload(!reload)
      utils.notification('Attribute updated successfully', 'success')
      setShowDetails(false)
    } catch (err) {
      utils.showError(err)
    }
  }

  return (
    <common.Card className="flex w-full gap-4 p-3 bg-gray-100 border border-gray-300 dark:bg-menu-primary">
      <div className="flex gap-4">
        <div>
          <common.Buttons.WhiteOutline
            type="button"
            onClick={() => setShowDetails(false)}
          >
            Close
          </common.Buttons.WhiteOutline>
        </div>

        <p className="flex gap-4 my-2 text-sm text-gray-500">
          {selectedEntity} . {attribute}{' '}
          <ArrowNarrowRightIcon className="w-5" />
          {schemaTables![selectedEntity as string][attribute].type}
        </p>
      </div>
      <form
        className="flex flex-1 gap-4"
        onSubmit={handleSubmit(Save as SubmitHandler<FieldValues>)}
      >
        <Controller
          name="Name"
          defaultValue={attribute}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder="Association name"
                value={value}
                onChange={onChange}
                errors={errors.Name}
              />
            </div>
          )}
        />
        <div className="flex justify-between gap-4">
          <common.Buttons.RedOutline
            type="button"
            loading={false}
            disabled={false}
            onClick={() => setOpenModal(true)}
          >
            Remove
          </common.Buttons.RedOutline>
          <common.Buttons.YellowOutline
            type="submit"
            loading={false}
            disabled={false}
          >
            Save
          </common.Buttons.YellowOutline>
        </div>
      </form>
      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        title={`Remove association?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this association?
            </p>
            <p className="text-sm font-bold text-gray-600">
              This action is irreversible
            </p>
          </>
        }
        buttonTitle="Remove association"
        handleSubmit={Remove}
      />
    </common.Card>
  )
}
