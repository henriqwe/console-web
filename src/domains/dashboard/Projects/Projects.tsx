import * as common from 'common'
import * as utils from 'utils'
import axios from 'axios'
import { PlusIcon, SearchIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

export function Projects() {
  const router = useRouter()
  const { control, watch } = useForm()
  const [showFiltered, setShowFiltered] = useState(false)
  const [filteredSchemas, setFilteredSchemas] = useState<string[]>([])
  const [schemas, setSchemas] = useState<string[]>([])
  const [loadingSchemas, setLoadingSchemas] = useState(true)

  async function loadSchemas() {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/schemas`, {
        headers: {
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      })
      setSchemas(data.data)
    } catch (err: any) {
      if (err.response.status !== 404) {
        utils.notification(err.message, 'error')
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

    return schemas.filter((v) => v.match(re))
  }

  function filterSchemas() {
    setFilteredSchemas(match(watch('search')))
    setShowFiltered(true)
  }
  function removeFilterSchemas() {
    setFilteredSchemas([])
    setShowFiltered(false)
  }

  useEffect(() => {
    setLoadingSchemas(true)
    loadSchemas()
  }, [])

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
          <h1 className="pr-4 mr-4 text-2xl font-semibold text-gray-900 border-r border-r-gray-300">
            Projects
          </h1>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-[#B1C900]"
              onClick={() => {
                router.push(routes.createProject)
              }}
            >
              <PlusIcon className="w-5 h-5 text-white" />
            </button>
            <p className="text-lg">New Project</p>
          </div>
        </div>
        <div className="relative flex items-center">
          <SearchIcon className="absolute w-5 h-5 text-gray-400 left-2" />
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
            <common.Card className="p-6 bg-white shadow-sm" key={schema}>
              <div className="flex items-center justify-between">
                <p className="text-lg">{schema}</p>
                <button
                  className="px-3 py-2 text-white bg-indigo-500 rounded-lg"
                  onClick={() => {
                    router.push(`${routes.console}/${schema}`)
                  }}
                >
                  Launch console
                </button>
              </div>
            </common.Card>
          ))
        )}
      </section>
    </div>
  )
}
