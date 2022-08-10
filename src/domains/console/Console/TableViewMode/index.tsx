import { useEffect, useState } from 'react'

import * as common from 'common'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import * as utils from 'utils'

type tableColumnType = {
  name: string
  displayName: string
  handler?: (key: any) => void
}

const keysToExcludeInFilter = ['_role', '_user', '_version']

export function TableViewMode() {
  const { consoleResponse } = consoleEditor.useConsoleEditor()
  const [tableColumns, setTableColumns] = useState<tableColumnType[]>([])

  function handleTableColumns() {
    try {
      if (consoleResponse?.length === 0) {
        setTableColumns([])
        return
      }
      const value = Array.isArray(consoleResponse)
        ? consoleResponse
        : [consoleResponse]
      const columns: tableColumnType[] = []
      Object?.keys(value[0]).map((key) => {
        if (!keysToExcludeInFilter.includes(key)) {
          let data: tableColumnType = {
            name: key,
            displayName: key
          }
          data.handler = (key) => key ?? 'null'

          if (key === '_createdat' || key === '_updatedat') {
            data.handler = (value) =>
              value ? utils.ptBRtimeStamp(new Date(Number(value))) : 'null'
          }
          columns.push(data)
        }
      })
      const columnsSorted = columns
        .sort((a, b) => {
          if (a.name === '_id') {
            return 1
          }

          if (a.name > b.name) {
            return -1
          }
          if (a.name < b.name) {
            return 1
          }
          return 0
        })
        .sort((a, b) => {
          if (a.name === '_updatedat') {
            return -1
          }
          if (a.name === '_createdat') {
            return -1
          }

          if (a.name === '_id') {
            return -1
          }

          if (a.name > b.name) {
            return -1
          }
          return 0
        })
      setTableColumns(columnsSorted)
    } catch (err) {
      utils.showError(err)
    }
  }

  useEffect(() => {
    handleTableColumns()
  }, [consoleResponse])

  return tableColumns.length === 0 ? (
    <div className="flex items-center justify-center w-full ">
      <div className="flex flex-col items-center ">
        <div className="mb-5 w-72">
          <common.illustrations.Empty />
        </div>
        <div className="text-lg">No data to list</div>
      </div>
    </div>
  ) : (
    <common.Table
      tableColumns={tableColumns}
      values={
        Array.isArray(consoleResponse) ? consoleResponse : [consoleResponse]
      }
    />
  )
}
