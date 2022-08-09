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
import { useId } from 'react'

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
        utils.showError(err)
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
    <div className="flex justify-center">
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none blur-xl">
        <div className="flex justify-end flex-none w-full">
          <img
            src="/assets/images/green-blur-test.png"
            alt=""
            className="w-[71.75rem] flex-none max-w-none"
          />
        </div>
      </div>
      <div className="z-20 flex flex-col w-4/6 gap-y-8">
        <section className="flex justify-between w-full mx-auto">
          <div className="flex">
            <h1 className="pr-4 mr-1 text-2xl font-semibold text-gray-900 border-r dark:text-gray-100 border-r-gray-300 dark:border-r-gray-600">
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
                <div className="flex items-center gap-2 dark:text-gray-100">
                  <p className="text-xs ">New Project</p>
                  <PlusIcon className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
          <div className="relative flex items-center">
            <SearchIcon className="absolute w-4 h-4 text-gray-400 dark:text-gray-200 left-2" />
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

        <section className="flex flex-col w-full gap-8 mx-auto">
          {loadingSchemas ? (
            <div className="flex flex-col items-center justify-center gap-2 mt-32">
              <div className="w-20 h-20 dark:text-white">
                <common.Spinner />
              </div>
              <p className="dark:text-gray-200">Loading projects</p>
            </div>
          ) : (showFiltered ? filteredSchemas : schemas).length === 0 ? (
            <div className="flex flex-col mt-16 text-center gap-y-6">
              <div className="m-auto w-80">
                <common.illustrations.Empty />
              </div>
              <p className="text-lg dark:text-gray-200">Projects not found</p>
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
  const [showCopyText, setShowCopyText] = useState(false)
  const router = useRouter()
  return (
    <common.Card
      className="flex p-6 bg-white border shadow-sm dark:bg-slate-800 dark:border-gray-700"
      key={schema.createdat}
    >
      <div className="grid items-center justify-between flex-1 grid-cols-4 gap-4">
        <div>
          <p className="text-2xl dark:text-white">{schema.name}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Standard</p>
        </div>
        <div className="dark:text-white">
          <p>Project secret: </p>
          <div className="relative flex w-full h-full">
            <input
              disabled
              value={schema.tenantAc}
              type="password"
              className="w-40 text-xs bg-transparent dark:text-slate-400"
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
                  className="w-5 h-5 text-gray-700 cursor-pointer dark:text-gray-300"
                  onClick={() => navigator.clipboard.writeText(schema.tenantAc)}
                />
              </div>
            </CopyToClipboard>
          </div>
        </div>
        <div className="flex items-center justify-around flex-1 col-span-1">
          <div className="p-2">
            <p className="text-sm dark:text-white">Traffic: </p>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              50.000 requests per day
            </p>
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
            <PlayIcon className="w-6 h-6 text-green-700 dark:text-green-300" />
          </button>

          <button
            className="px-1 py-1"
            onClick={() => {
              onConfigClick(schema)
            }}
          >
            <CogIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
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

function HeroBackground(props: any) {
  let id = useId()
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 668 1069"
      width={668}
      height={1069}
      fill="none"
      {...props}
    >
      <defs>
        <clipPath id={`${id}-clip-path`}>
          <path
            fill="#fff"
            transform="rotate(-180 334 534.4)"
            d="M0 0h668v1068.8H0z"
          />
        </clipPath>
      </defs>
      <g opacity=".4" clipPath={`url(#${id}-clip-path)`} strokeWidth={4}>
        <path
          opacity=".3"
          d="M584.5 770.4v-474M484.5 770.4v-474M384.5 770.4v-474M283.5 769.4v-474M183.5 768.4v-474M83.5 767.4v-474"
          stroke="#334155"
        />
        <path
          d="M83.5 221.275v6.587a50.1 50.1 0 0 0 22.309 41.686l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M83.5 716.012v6.588a50.099 50.099 0 0 0 22.309 41.685l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M183.7 584.5v6.587a50.1 50.1 0 0 0 22.31 41.686l55.581 37.054a50.097 50.097 0 0 1 22.309 41.685v6.588M384.101 277.637v6.588a50.1 50.1 0 0 0 22.309 41.685l55.581 37.054a50.1 50.1 0 0 1 22.31 41.686v6.587M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588"
          stroke="#334155"
        />
        <path
          d="M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588M484.3 594.937v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054A50.1 50.1 0 0 0 384.1 721.95v6.587M484.3 872.575v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054a50.098 50.098 0 0 0-22.309 41.686v6.582M584.501 663.824v39.988a50.099 50.099 0 0 1-22.31 41.685l-55.581 37.054a50.102 50.102 0 0 0-22.309 41.686v6.587M283.899 945.637v6.588a50.1 50.1 0 0 1-22.309 41.685l-55.581 37.05a50.12 50.12 0 0 0-22.31 41.69v6.59M384.1 277.637c0 19.946 12.763 37.655 31.686 43.962l137.028 45.676c18.923 6.308 31.686 24.016 31.686 43.962M183.7 463.425v30.69c0 21.564 13.799 40.709 34.257 47.529l134.457 44.819c18.922 6.307 31.686 24.016 31.686 43.962M83.5 102.288c0 19.515 13.554 36.412 32.604 40.645l235.391 52.309c19.05 4.234 32.605 21.13 32.605 40.646M83.5 463.425v-58.45M183.699 542.75V396.625M283.9 1068.8V945.637M83.5 363.225v-141.95M83.5 179.524v-77.237M83.5 60.537V0M384.1 630.425V277.637M484.301 830.824V594.937M584.5 1068.8V663.825M484.301 555.275V452.988M584.5 622.075V452.988M384.1 728.537v-56.362M384.1 1068.8v-20.88M384.1 1006.17V770.287M283.9 903.888V759.85M183.699 1066.71V891.362M83.5 1068.8V716.012M83.5 674.263V505.175"
          stroke="#334155"
        />
        <circle
          cx="83.5"
          cy="384.1"
          r="10.438"
          transform="rotate(-180 83.5 384.1)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="83.5"
          cy="200.399"
          r="10.438"
          transform="rotate(-180 83.5 200.399)"
          stroke="#334155"
        />
        <circle
          cx="83.5"
          cy="81.412"
          r="10.438"
          transform="rotate(-180 83.5 81.412)"
          stroke="#334155"
        />
        <circle
          cx="183.699"
          cy="375.75"
          r="10.438"
          transform="rotate(-180 183.699 375.75)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="183.699"
          cy="563.625"
          r="10.438"
          transform="rotate(-180 183.699 563.625)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="384.1"
          cy="651.3"
          r="10.438"
          transform="rotate(-180 384.1 651.3)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="484.301"
          cy="574.062"
          r="10.438"
          transform="rotate(-180 484.301 574.062)"
          fill="#0EA5E9"
          fillOpacity=".42"
          stroke="#0EA5E9"
        />
        <circle
          cx="384.1"
          cy="749.412"
          r="10.438"
          transform="rotate(-180 384.1 749.412)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="384.1"
          cy="1027.05"
          r="10.438"
          transform="rotate(-180 384.1 1027.05)"
          stroke="#334155"
        />
        <circle
          cx="283.9"
          cy="924.763"
          r="10.438"
          transform="rotate(-180 283.9 924.763)"
          stroke="#334155"
        />
        <circle
          cx="183.699"
          cy="870.487"
          r="10.438"
          transform="rotate(-180 183.699 870.487)"
          stroke="#334155"
        />
        <circle
          cx="283.9"
          cy="738.975"
          r="10.438"
          transform="rotate(-180 283.9 738.975)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="83.5"
          cy="695.138"
          r="10.438"
          transform="rotate(-180 83.5 695.138)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="83.5"
          cy="484.3"
          r="10.438"
          transform="rotate(-180 83.5 484.3)"
          fill="#0EA5E9"
          fillOpacity=".42"
          stroke="#0EA5E9"
        />
        <circle
          cx="484.301"
          cy="432.112"
          r="10.438"
          transform="rotate(-180 484.301 432.112)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="584.5"
          cy="432.112"
          r="10.438"
          transform="rotate(-180 584.5 432.112)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="584.5"
          cy="642.95"
          r="10.438"
          transform="rotate(-180 584.5 642.95)"
          fill="#1E293B"
          stroke="#334155"
        />
        <circle
          cx="484.301"
          cy="851.699"
          r="10.438"
          transform="rotate(-180 484.301 851.699)"
          stroke="#334155"
        />
        <circle
          cx="384.1"
          cy="256.763"
          r="10.438"
          transform="rotate(-180 384.1 256.763)"
          stroke="#334155"
        />
      </g>
    </svg>
  )
}
