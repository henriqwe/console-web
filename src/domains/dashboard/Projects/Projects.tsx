import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import axios from 'axios'
import { Icon } from '@iconify/react'
import {
  PlusIcon,
  SearchIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/outline'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { PlayIcon, CogIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

type Schemas = {
  createdat: number
  name: string
  status: string
  tenantAc: string
  tenantId: string
}

export function Projects() {
  const router = useRouter()
  const { control, watch } = useForm()
  const {
    setOpenSlide,
    setSlideType,
    setSlideSize,
    setSelectedSchema,
    reload
  } = dashboard.useData()
  const [showFiltered, setShowFiltered] = useState(false)
  const [filteredSchemas, setFilteredSchemas] = useState<Schemas[]>([])
  const [schemas, setSchemas] = useState<Schemas[]>([])
  const [loadingSchemas, setLoadingSchemas] = useState(true)

  async function loadSchemas() {
    try {
      const { data } = await utils.api.get(utils.apiRoutes.schemas, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      })
      setSchemas(data)
    } catch (err: any) {
      if (err.response.status !== 404) {
        utils.notification(err.message, 'error')
      }
    } finally {
      setLoadingSchemas(false)
    }
  }

  async function downloadSchema(schema: string) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/parserToJSON?parserName=${schema}`,
      {
        headers: {
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      }
    )
  }

  async function formatResponse(value: string) {
    let text = value
    const operations = [
      { searchValue: ',', replaceValue: ',\n  ' },
      { searchValue: '{', replaceValue: '{\n  ' },
      { searchValue: '}', replaceValue: '\n}' }
    ]
    operations.forEach((op) => {
      text = text.replaceAll(op.searchValue, op.replaceValue)
    })
    return text
  }

  const match = (value: string) => {
    const p = Array.from(value).reduce(
      (a, v, i) => `${a}[^${value.substr(i)}]*?${v}`,
      ''
    )
    const re = RegExp(p)

    return schemas.filter((v) => v.name.match(re))
  }

  function filterSchemas() {
    setFilteredSchemas(match(watch('search')))
    setShowFiltered(true)
  }
  function removeFilterSchemas() {
    setFilteredSchemas([])
    setShowFiltered(false)
  }

  function onConfigClick(schema: Schemas) {
    setOpenSlide(true)
    setSlideType('VIEW')
    setSlideSize('normal')
    setSelectedSchema(schema)
  }

  useEffect(() => {
    setLoadingSchemas(true)
    loadSchemas()
  }, [reload])

  useEffect(() => {
    if (watch('search')) {
      const timeoutId = setTimeout(() => filterSchemas(), 1000)
      return () => clearTimeout(timeoutId)
    }
    removeFilterSchemas()
  }, [watch('search')])

  return (
    <div className="py-6 bg-gray-100 min-h-[100vh]">
      <section className="flex justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex">
          <h1 className="pr-4 mr-1 text-2xl font-semibold text-gray-900 border-r border-r-gray-300">
            Projects
          </h1>
          <div className="flex items-center">
            <button
              className="px-2 py-2"
              onClick={() => {
                setOpenSlide(true)
                setSlideType('CREATE')
                setSlideSize('halfPage')
                // router.push(routes.createProject)
              }}
            >
              <div className="flex items-center gap-2">
                <p className="text-xs">New Project</p>
                <PlusIcon className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
        <div className="relative flex items-center">
          <SearchIcon className="absolute w-4 h-4 text-gray-400 left-2" />
          <Controller
            name="search"
            control={control}
            render={({ field: { onChange, value } }) => (
              <common.Input
                placeholder="Search Projects..."
                className="pl-8"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </div>
      </section>
      <section className="flex flex-col h-full gap-4 px-4 mx-auto mt-10 max-w-7xl sm:px-6 md:px-8">
        {loadingSchemas ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-32">
            <div className="w-20 h-20">
              <common.Spinner />
            </div>
            <p>Loading projects</p>
          </div>
        ) : (showFiltered ? filteredSchemas : schemas).length === 0 ? (
          <div className="mt-16 text-center">
            <div className="max-w-sm m-auto mb-5">
              <common.illustrations.Empty />
            </div>
            <p className="text-lg">Projects not found</p>
          </div>
        ) : (
          (showFiltered ? filteredSchemas : schemas).map((schema) => (
            <Project
              key={schema.createdat}
              schema={schema}
              onConfigClick={onConfigClick}
            />
          ))
        )}
      </section>

      <dashboard.SlidePanel />
    </div>
  )
}

export function Project({
  schema,
  onConfigClick
}: {
  schema: Schemas
  onConfigClick: (schema: Schemas) => void
}) {
  const [showCopyText, setShowCopyText] = useState(false)
  const router = useRouter()
  return (
    <common.Card className="flex p-6 bg-white shadow-sm" key={schema.createdat}>
      <div className="grid items-center justify-between flex-1 grid-cols-5 gap-4">
        <div>
          <p className="text-2xl">{schema.name}</p>
          <p className="text-xs text-gray-600">Standard</p>
        </div>
        <div>
          <p>Project secret: </p>
          <div className="relative flex w-full h-full">
            <input
              disabled
              value={schema.tenantAc}
              type="password"
              className="w-40 text-xs bg-transparent"
            />
            <CopyToClipboard
              text="Copy to clipboard"
              onCopy={() => {
                setShowCopyText(true)
                setTimeout(() => {
                  setShowCopyText(false)
                }, 800)
              }}
            >
              <div>
                {showCopyText && (
                  <span className="absolute right-0 bottom-5">Copied!</span>
                )}
                <DocumentDuplicateIcon
                  className="w-5 h-5 text-gray-700 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(schema.tenantAc)}
                />
              </div>
            </CopyToClipboard>
          </div>
        </div>
        <div className="flex items-center justify-around flex-1 col-span-2">
          <div className="p-2">
            <p className="text-sm">Traffic: </p>
            <p className="text-xs text-gray-600">50.000 requests per day</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <Icon icon="logos:aws" className="w-6 h-6" />
            <p className="text-xs text-gray-600">AWS</p>
          </div>
        </div>

        <div className="flex items-end justify-end">
          <button
            className="px-1 py-1"
            onClick={() => {
              // if (
              //   utils.getCookie('X-TenantID')?.split('@')[1] !== schema.name
              // ) {
              //   utils.removeCookie('X-TenantID')
              //   utils.removeCookie('admin_access_token')
              // }
              utils.setCookie('X-TenantID', schema.tenantId)
              utils.setCookie('X-TenantAC', schema.tenantAc)
              router.push(`${routes.console}/${schema.name}`)
            }}
          >
            <PlayIcon className="w-6 h-6 text-green-700" />
          </button>

          <button
            className="px-1 py-1"
            onClick={() => {
              onConfigClick(schema)
            }}
          >
            <CogIcon className="w-6 h-6 text-gray-600" />
          </button>
          {/* <button
          className="px-1 py-1 text-white bg-indigo-500 rounded-lg"
          onClick={() => {
            downloadSchema(schema)
          }}
        >
          <DownloadIcon className="w-6 h-6 text-white" />
        </button> */}
        </div>
      </div>
    </common.Card>
  )
}
