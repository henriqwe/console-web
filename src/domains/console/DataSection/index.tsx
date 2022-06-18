import * as common from 'common'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getCookie } from 'utils/cookies'

export function DataSection() {
  const { selectedTable } = consoleSection.useData()
  const [loading, setLoading] = useState(true)
  const [tableData, setTableData] = useState('')

  async function loadTableData() {
    const { data } = await axios.get(
      `https://api.ycodify.com/api/modeler/schema/${'academia'}/entity/${selectedTable}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    // setTableData()
    console.log(data)
    setLoading(false)
  }

  useEffect(() => {
    if (selectedTable) {
      loadTableData()
    }
  }, [selectedTable])

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full h-[3.5rem] px-4 bg-gray-200 border-gray-300 rounded-t-lg border-x">
        <p className="text-lg font-bold text-gray-700">
          {selectedTable ? selectedTable : 'Tables'}
        </p>
      </div>
      {selectedTable ? (
        <div
          className={`flex ${
            loading ? 'items-center' : 'items-start'
          } justify-center h-full px-6 pt-10 bg-white rounded-b-lg`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20">
                <common.Spinner />
              </div>

              <p className="text-lg font-bold text-gray-700">
                Loading table data
              </p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>title</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>value</td>
                </tr>
              </tbody>
            </table>
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
