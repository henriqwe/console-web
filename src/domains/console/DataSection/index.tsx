import * as common from 'common'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'

type TableData = {
  name: string
  comment: string
  createdAt: number
  isIndex: boolean
  isNullable: boolean
  isUnique: boolean
  length: number
  type: string
}

export function DataSection() {
  const router = useRouter()
  const { selectedTable, reload } = consoleSection.useData()
  const [selectedTab, setSelectedTab] = useState({
    name: 'Browser rows'
  })
  const [loading, setLoading] = useState(true)
  const [tableFields, setTableFields] = useState<string[]>([])
  const [tableData, setTableData] = useState<TableData[]>()

  async function loadTableData() {
    const { data } = await axios.get(
      `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    const tableData: TableData[] = []
    Object.keys(data).map((key) => {
      if (key !== '_classDef') {
        tableData.push({
          name: key,
          ...data[key]
        })
      }
    })
    setTableFields(Object.keys(data).filter((value) => value[0] !== '_'))
    setTableData(tableData)
    setLoading(false)
  }

  useEffect(() => {
    if (selectedTable) {
      loadTableData()
    }
  }, [selectedTable, reload])

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full px-4 bg-gray-200 border-gray-300 rounded-t-lg min-h-[4rem] border-x">
        <p className="text-lg font-bold text-gray-700">
          {selectedTable ? selectedTable : 'Tables'}
        </p>
      </div>
      {selectedTable ? (
        <div>
          <common.Tabs
            tabs={[{ name: 'Browser rows' }, { name: 'Modify' }]}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          {selectedTab.name === 'Browser rows' ? (
            <consoleSection.BrowserRowsTab
              loading={loading}
              tableFields={tableFields}
            />
          ) : (
            <consoleSection.ModifyTab
              loading={loading}
              tableData={tableData}
            />
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
