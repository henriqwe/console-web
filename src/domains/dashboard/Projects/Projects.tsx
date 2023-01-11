import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import * as services from 'services'
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
import { useUser } from 'contexts/UserContext'
import { useLocalTour } from 'contexts/TourContext'

type Schemas = {
  createdat: number
  name: string
  status: string
  tenantAc: string
  tenantId: string
}

export function Projects() {
  const { user } = useUser()

  const { control, watch } = useForm()
  const {
    setOpenSlide,
    setSlideType,
    setSlideSize,
    setSelectedSchema,
    reload,
    schemas,
    setSchemas
  } = dashboard.useData()

  const [showFiltered, setShowFiltered] = useState(false)
  const [filteredSchemas, setFilteredSchemas] = useState<Schemas[]>([])
  const [loadingSchemas, setLoadingSchemas] = useState(true)
  const { nextStep } = useLocalTour()

  async function loadSchemas() {
    try {
      const { data } = await services.ycodify.getSchemas({
        accessToken: user?.accessToken!
      })

      setSchemas(data)
    } catch (err: any) {
      if (err.response.status !== 404) {
        utils.showError(err)
      }
    } finally {
      setLoadingSchemas(false)
    }
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
    setSlideType('viewProject')
    setSlideSize('normal')
    setSelectedSchema(schema)
  }

  useEffect(() => {
    setLoadingSchemas(true)
    loadSchemas()
  }, [reload])

  useEffect(() => {
    if (watch('search') && watch('search') !== '') {
      const timeoutId = setTimeout(() => {
        filterSchemas()
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
    removeFilterSchemas()
  }, [watch('search')])

  return (
    <div className="flex justify-center dashboard-step-6">
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none blur-xl">
        <div className="flex justify-end flex-none w-full">
          <img
            src="/assets/images/green-blur-test.png"
            alt=""
            className="w-[71.75rem] flex-none max-w-none"
          />
        </div>
      </div>
      <div className="z-20 flex flex-col w-full gap-y-8">
        <section className="flex justify-between w-full mx-auto">
          <div className="flex">
            <h1 className="pr-4 mr-1 text-2xl font-semibold text-gray-900 border-r dark:text-text-primary border-r-gray-300 dark:border-r-gray-600">
              Projects
            </h1>
            <div className="flex items-center">
              <button
                className="px-2 py-2"
                onClick={() => {
                  setOpenSlide(true)
                  setSlideType('createProject')
                  setSlideSize('normal')
                  nextStep()
                  // router.push(routes.createProject)
                }}
              >
                <div className="flex items-center gap-2 dashboard-step-8 dark:text-text-primary">
                  <p className="text-xs">New Project</p>
                  <PlusIcon className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
          <div className="relative flex items-center dashboard-step-7">
            <SearchIcon className="absolute w-4 h-4 text-gray-400 dark:text-text-primary left-2" />
            <Controller
              name="search"
              control={control}
              defaultValue={''}
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

        <section
          className="grid w-full grid-cols-1 gap-6 mx-auto"
          data-testid="projects"
        >
          {loadingSchemas ? (
            <div className="flex flex-col items-center justify-center col-span-2 gap-2 mt-32">
              <div className="w-20 h-20 dark:text-text-primary">
                <common.Spinner />
              </div>
              <p className="dark:text-text-primary">Loading projects</p>
            </div>
          ) : (showFiltered ? filteredSchemas : schemas).length === 0 ? (
            <div className="flex flex-col col-span-2 mt-16 text-center gap-y-6">
              <div className="m-auto w-80">
                <common.illustrations.Empty />
              </div>
              <p className="text-lg dark:text-text-primary">
                Projects not found
              </p>
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
      </div>

      <div className="z-20">
        <dashboard.SlidePanel />
      </div>
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
  const router = useRouter()
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-2xl dark:text-text-primary">{schema.name}</p>
      <common.Card
        className="flex p-6 bg-white border shadow-sm dark:bg-menu-primary dark:border-gray-700"
        key={schema.createdat}
      >
        <div className="grid items-center justify-between flex-1 grid-cols-5 gap-4">
          <div className="col-span-2 dark:text-text-primary">
            <p>Project secret: </p>
            <div className="relative flex w-full h-full">
              <input
                disabled
                value={schema.tenantAc}
                type="password"
                className="w-40 text-xs truncate bg-transparent dark:text-text-tertiary"
              />
              <CopyToClipboard
                text="Copy to clipboard"
                onCopy={() => {
                  utils.notification('Copied to clipboard', 'success')
                }}
              >
                <div title="Copy">
                  <DocumentDuplicateIcon
                    className="w-5 h-5 text-gray-700 cursor-pointer dark:text-text-tertiary"
                    onClick={() =>
                      navigator.clipboard.writeText(schema.tenantAc)
                    }
                  />
                </div>
              </CopyToClipboard>
            </div>
          </div>
          <div className="flex items-center justify-start flex-1 col-span-2">
            <div className="py-2">
              <p className="text-sm dark:text-text-primary">Traffic: </p>
              <p className="text-xs text-gray-600 dark:text-text-tertiary">
                50.000 requests per day
              </p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <button
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
              title="Access project"
            >
              <PlayIcon className="w-6 h-6 text-iconGreen" />
            </button>

            <button
              onClick={() => {
                onConfigClick(schema)
              }}
              title="configuration"
            >
              <CogIcon className="w-6 h-6 text-gray-600 dark:text-text-secondary" />
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
    </div>
  )
}
