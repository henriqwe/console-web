import { useEffect, useState } from 'react'

import * as common from 'common'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import * as utils from 'utils'

type tableColumnType = {
  name: string
  displayName: string
  handler?: (key: any) => void
}

export function TableViewMode() {
  const { consoleResponse } = consoleEditor.useConsoleEditor()
  const [tableColumns, setTableColumns] = useState<tableColumnType[]>([])

  function handleTableColumns() {
    if (consoleResponse.length === 0) {
      setTableColumns([])
      return
    }
    let columns: tableColumnType[] = []
    Object?.keys(consoleResponse[0]).map((key) => {
      if (
        key !== '_classDef' &&
        key !== 'role' &&
        key !== 'classUID' &&
        key !== 'user'
      ) {
        let data: tableColumnType = {
          name: key,
          displayName: [key][0]
        }
        data.handler = (key) => key ?? 'null'

        if (key === 'createdat' || key === 'updatedat') {
          data.handler = (key) =>
            key ? utils.ptBRtimeStamp(new Date(key)) : 'null'
        }
        columns.push(data)
      }
    })
    const columnsSorted = columns
      .sort((a, b) => {
        if (a.name === 'id') {
          return 1
        }
        if (a.name === 'version') {
          return -1
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
        if (a.name === 'updatedat') {
          return -1
        }
        if (a.name === 'createdat') {
          return -1
        }

        if (a.name === 'id') {
          return -1
        }
        if (a.name === 'version') {
          return 1
        }
        if (a.name > b.name) {
          return -1
        }
        return 0
      })
    setTableColumns(columnsSorted)
  }
  useEffect(() => {
    handleTableColumns()
  }, [consoleResponse])

  return tableColumns.length === 0 ? (
    <div className="flex items-center justify-center w-full ">
      <div className=" flex flex-col items-center">
        <div className="mb-5 w-72">
          <common.illustrations.Empty />
        </div>
        <div className="text-lg">No data to list</div>
      </div>
    </div>
  ) : (
    <common.Table tableColumns={tableColumns} values={consoleResponse} />
  )
}
