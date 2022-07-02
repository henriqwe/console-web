import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { PencilIcon, XIcon, CheckIcon } from '@heroicons/react/outline'
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues
} from 'react-hook-form'
import * as utils from 'utils'

export function DataSection() {
  const router = useRouter()
  const {
    selectedTable,
    setSelectedTable,
    reload,
    setReload,
    tableData,
    setTableData
  } = consoleSection.useData()
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm()
  const [updateName, setUpdateName] = useState(false)
  const [selectedTab, setSelectedTab] = useState({
    name: 'Browser rows'
  })
  const [loading, setLoading] = useState(true)

  async function loadTableData() {
    const { data } = await axios.get(
      `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    const tableData: types.TableData[] = []
    Object.keys(data).map((key) => {
      if (key !== '_classDef') {
        tableData.push({
          name: key,
          ...data[key]
        })
      }
    })
    const tableFields = Object.keys(data).filter((value) => value[0] !== '_')
    tableFields.unshift('id')
    setTableData(tableData)
    setLoading(false)
  }

  async function updateTableName(formData: { Name: string }) {
    try {
      await axios.put(
        `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
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
      utils.notification('Table name updated successfully', 'success')
      setSelectedTable(formData.Name)
      setUpdateName(false)
      setReload(!reload)
    } catch (err: any) {
      utils.notification(err.message, 'error')
    }
  }

  useEffect(() => {
    if (selectedTable) {
      loadTableData()
    }
    return () => setLoading(true)
  }, [selectedTable, reload])

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full px-4 bg-gray-200 border-gray-300 rounded-t-lg min-h-[4rem] border-x gap-2">
        {updateName ? (
          <form
            className="flex gap-2"
            onSubmit={handleSubmit(
              updateTableName as SubmitHandler<FieldValues>
            )}
          >
            <Controller
              name="Name"
              defaultValue={selectedTable}
              control={control}
              render={({ field: { onChange, value } }) => (
                <common.Input
                  placeholder="field name"
                  value={value}
                  onChange={onChange}
                  errors={errors.Name}
                />
              )}
            />
            <common.Button
              type="button"
              color="red"
              onClick={() => setUpdateName(false)}
            >
              <XIcon className="w-5 h-5" />
            </common.Button>
            <common.Button type="submit" color="green">
              <CheckIcon className="w-5 h-5" />
            </common.Button>
          </form>
        ) : (
          <>
            <p className="text-lg font-bold text-gray-700">
              {selectedTable ? selectedTable : 'Tables'}
            </p>
            {selectedTable && (
              <PencilIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => setUpdateName(true)}
              />
            )}
          </>
        )}
      </div>
      {selectedTable ? (
        <div>
          <common.Tabs
            tabs={[{ name: 'Browser rows' }, { name: 'Modify' }]}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          {selectedTab.name === 'Browser rows' ? (
            <consoleSection.BrowserRowsTab />
          ) : (
            <consoleSection.ModifyTab loading={loading} />
          )}
        </div>
      ) : (
        <div className={`flex h-full px-6 pt-10 bg-white rounded-b-lg`}>
          <p className="text-lg text-gray-700">
            Select a table to see all data
          </p>
        </div>
      )}
    </common.Card>
  )
}
