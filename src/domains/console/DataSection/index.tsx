import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import * as utils from 'utils'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { PencilIcon } from '@heroicons/react/outline'

export function DataSection() {
  const router = useRouter()
  const {
    selectedTable,
    setOpenSlide,
    reload,
    setTableData,
    showCreateTableSection,
    setSlideType
  } = consoleSection.useData()
  const [loading, setLoading] = useState(true)

  async function loadTableData() {
    const { data } = await utils.api.get(
      `${utils.apiRoutes.entity(router.query.name as string)}/${selectedTable}`,
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

  useEffect(() => {
    if (selectedTable) {
      loadTableData()
    }
    return () => setLoading(true)
  }, [selectedTable, reload])

  if (showCreateTableSection) {
    return <consoleSection.CreateTable />
  }

  return (
    <div data-tour="step-1" className="w-full h-full">
      <common.Card className="flex flex-col h-full">
        <consoleSection.SlidePanel />
        <common.ContentSection
          title={
            <div className="flex gap-2">
              <p className="text-base text-gray-900">
                {selectedTable ? selectedTable : 'Entities'}
              </p>
              {selectedTable && (
                <PencilIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setOpenSlide(true)
                    setSlideType('UPDATE TABLE')
                  }}
                />
              )}
            </div>
          }
        >
          {/* <consoleSection.RelationshipTab loading={loading} /> */}
          {selectedTable ? (
            <consoleSection.ModifyTab loading={loading} />
          ) : (
            <consoleSection.DefaultPage />
          )}
        </common.ContentSection>
      </common.Card>
    </div>
  )
}
