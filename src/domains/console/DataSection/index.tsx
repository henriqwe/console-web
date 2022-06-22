import * as common from 'common'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'

export function DataSection() {
  const router = useRouter()
  const { selectedTable } = consoleSection.useData()
  const [selectedTab, setSelectedTab] = useState({
    name: 'Browser rows'
  })
  const [loading, setLoading] = useState(true)
  const [tableFields, setTableFields] = useState<string[]>([])
  const [tableData, setTableData] = useState('')

  async function loadTableData() {
    const { data } = await axios.get(
      `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    setTableFields(Object.keys(data).filter((value) => value[0] !== '_'))
    setLoading(false)
  }

  useEffect(() => {
    if (selectedTable) {
      loadTableData()
    }
  }, [selectedTable])

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full h-16 px-4 bg-gray-200 border-gray-300 rounded-t-lg border-x">
        <p className="text-lg font-bold text-gray-700">
          {selectedTable ? selectedTable : 'Tables'}
        </p>
      </div>
      {selectedTable ? (
        <div
          className={`flex flex-col ${
            loading ? 'items-center justify-center' : 'items-start'
          } h-full bg-white rounded-b-lg`}
        >
          <common.Tabs
            tabs={[{ name: 'Browser rows' }, { name: 'Modify' }]}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
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
            <div className="w-full h-full bg-orange-300 p-6 max-h-[10vh]">
              <table className="w-full">
                <thead>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <th key={field} className="border">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="overflow-y-auto bg-blue-300">
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>{' '}
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    {tableFields.map((field) => (
                      <td key={field} className="border">
                        value
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
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
