import * as utils from 'utils'
import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleData from 'domains/console'
import {
  PencilIcon,
  XIcon,
  CheckIcon,
  ArrowNarrowRightIcon
} from '@heroicons/react/outline'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

type FormData = {
  name: string
}

export function FieldDetail({
  data,
  setShowDetails
}: {
  data: { name: string }
  setShowDetails: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const [activeFields, setActiveFields] = useState({
    Name: true,
    Type: true,
    Nullable: true,
    Unique: true,
    Index: true,
    Comment: true
  })
  const { fieldSchema, selectedEntity, setReload, reload } =
    consoleData.useSchemaManager()

  const {
    watch,
    formState: { errors },
    control
  } = useForm({ resolver: yupResolver(fieldSchema) })

  async function Save(formData: FormData) {
    // await utils.api.put(
    //   `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedTable}/attribute/${data.name}`,
    //   formData,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${utils.getCookie('access_token')}`
    //     }
    //   }
    // )
    // setReload(!reload)
    // utils.notification('attribute updated successfully', 'success')
    // setShowDetails(false)
  }

  async function Remove() {
    // await utils.api.delete(
    //   `${utils.apiRoutes.attribute({
    //     projectName: router.query.name as string,
    //     entityName: selectedTable as string
    //   })}/${data.name}`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${utils.getCookie('access_token')}`
    //     }
    //   }
    // )
    // setReload(!reload)
    // utils.notification('attribute updated successfully', 'success')
    // setShowDetails(false)
  }

  return (
    <common.Card className="p-3 bg-gray-100 border border-gray-300">
      <div className="flex flex-col">
        <div>
          <button
            className="px-1 py-1 text-sm bg-white border border-gray-300 rounded-md"
            type="button"
            onClick={() => setShowDetails(false)}
          >
            Close
          </button>
        </div>

        <p className="flex gap-4 my-2 text-sm text-gray-500">
          Branch . Book_Id <ArrowNarrowRightIcon className="w-5" /> Book . Id
        </p>
      </div>
      <section className="flex flex-col gap-4">
        <Controller
          name="Name"
          defaultValue={data.name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder="Relationship name"
                value={value}
                onChange={onChange}
                errors={errors.Name}
              />
            </div>
          )}
        />
        <div className="flex justify-between gap-4">
          <common.Buttons.Red
            type="button"
            loading={false}
            disabled={false}
            onClick={() => setOpenModal(true)}
          >
            Remove
          </common.Buttons.Red>
          <common.Buttons.Yellow
            type="button"
            loading={false}
            disabled={false}
            onClick={() => setOpenModal(true)}
          >
            Save
          </common.Buttons.Yellow>
        </div>
      </section>
      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        title={`Remove relationship?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this relationship?
            </p>
            <p className="text-sm font-bold text-gray-600">
              this action is irreversible!!!
            </p>
          </>
        }
        buttonTitle="Remove relationship"
        handleSubmit={Remove}
      />
    </common.Card>
  )
}
