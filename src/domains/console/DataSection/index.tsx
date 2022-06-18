import * as common from 'common'
import { useEffect, useState } from 'react'

export function DataSection() {
  const [loading, setLoading] = useState(true)

  function loadTableData() {
    setLoading(false)
  }

  useEffect(() => {
    loadTableData()
  }, [])

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full h-12 px-4 bg-gray-200 border-gray-300 rounded-t-lg border-x">
        <p className="text-lg font-bold text-gray-700">Instrutor</p>
      </div>
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
    </common.Card>
  )
}
