import { Column } from './Column'
import * as utils from 'utils'
import * as common from 'common'
import * as consoleSection from 'domains/console'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

type ModifyTabProps = {
  loading: boolean
}

export function ModifyTab({ loading }: ModifyTabProps) {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const { tableData, selectedTable, setReload, reload, setSelectedTable } =
    consoleSection.useData()

  async function RemoveTable() {
    try {
      await axios.delete(
        `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setReload(!reload)
      setSelectedTable(undefined)
      utils.notification(
        `Table ${selectedTable} deleted successfully`,
        'success'
      )
    } catch (err: any) {
      utils.notification(err.message, 'error')
    }
  }

  return (
    <div
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full bg-gray-100 p-6 rounded-b-lg gap-2`}
    >
      <h3 className="text-lg">Columns:</h3>
      {tableData?.map((data) => (
        <Column key={data.name} data={data} />
      ))}

      <div className="flex gap-4 mt-4">
        <common.Button
          type="button"
          loading={false}
          disabled={false}
          color="red"
          onClick={() => setOpenModal(true)}
        >
          Remove
        </common.Button>
      </div>
      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        title={`Remove ${selectedTable} table?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this table?{' '}
            </p>
            <p className="text-sm font-bold text-gray-600">
              this action is irreversible!!!
            </p>
          </>
        }
        buttonTitle="Remove table"
        handleSubmit={RemoveTable}
      />
    </div>
  )
}
