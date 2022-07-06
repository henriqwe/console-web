import CodeMirror from '@uiw/react-codemirror'

import { useEffect, useState } from 'react'
import { javascript } from '@codemirror/lang-javascript'

import * as common from 'common'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import * as utils from 'utils'

type tableColumnType = {
  name: string
  displayName: string
  handler?: (key: any) => void
}

export function TableViewMode() {
  const { consoleResponse, consoleValueLastOperation } =
    consoleEditor.useConsoleEditor()
  const [tableColumns, setTableColumns] = useState<tableColumnType[]>([])

  function handleTableColumns() {
    let columns: tableColumnType[] = []
    Object.keys(consoleResponse[0]).map((key) => {
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
        if (key === 'createdat' || key === 'updatedat') {
          data.handler = (key) =>
            key ? utils.ptBRtimeStamp(new Date(key)) : '-'
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
    if (consoleResponse) {
      handleTableColumns()
    }
  }, [consoleResponse])

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full px-4 bg-gray-200 border-gray-300 rounded-t-lg min-h-[4rem] border-x gap-2">
        <p className="text-lg font-bold text-gray-700">Table view mode</p>
      </div>
      <div className={`flex flex-col h-full px-6 pt-5 bg-white rounded-b-lg`}>
        <div className="w-full h-full bg-gray-100 overflow-y">
          <div className="flex px-8 mt-4">
            <common.Accordion
              titles="Operation"
              content={
                <CodeMirror
                  value={consoleValueLastOperation}
                  className="flex w-full h-full"
                  width="100%"
                  editable={false}
                  extensions={[javascript({ jsx: true })]}
                />
              }
            />
          </div>
          <common.Table tableColumns={tableColumns} values={consoleResponse} />
        </div>
      </div>
    </common.Card>
  )
}
