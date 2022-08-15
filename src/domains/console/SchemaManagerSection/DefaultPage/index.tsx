import * as utils from 'utils'
import * as common from 'common'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PlusIcon } from '@heroicons/react/solid'

export function DefaultPage() {
  const router = useRouter()
  const [publish, setPublish] = useState(false)
  const { schemaStatus, setSchemaStatus } = consoleSection.useSchemaManager()
  const sections = [
    {
      name: {
        type: 'title',
        value: 'Getting started'
      }
    },
    {
      name: {
        type: 'link',
        value: 'Hello world'
      },
      description: 'Docs about the console.'
    },
    {
      name: {
        type: 'link',
        value: 'Hello world'
      },
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
    },
    {
      name: {
        type: 'link',
        value: 'Getting started'
      },
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
    }
  ]

  async function publishSchema(value: boolean) {
    try {
      await utils.api.put(
        `${utils.apiRoutes.schemas}/${router.query.name}`,
        { status: value ? 2 : 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${utils.getCookie('access_token')}`
          }
        }
      )
      setSchemaStatus(value ? 2 : 1)
    } catch (err) {
      utils.showError(err)
    }
  }

  useEffect(() => {
    setPublish(schemaStatus === 2)
  }, [schemaStatus])

  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Publish console version</p>
          <p className="text-sm text-gray-600 dark:text-text-tertiary">
            Active the toggle button to publish all modifications in a new
            version
          </p>
        </div>
        <div className="flex gap-2">
          Publish version
          <common.Toggle
            enabled={publish}
            onChange={(value) => {
              publishSchema(value)
              setPublish(value)
            }}
          />
        </div>
      </div>
      <common.Separator />
      <p className="mt-5 text-lg font-medium">Lorem ipsum dolor sit amet</p>
      <p className="my-5 text-base text-gray-600  dark:text-text-tertiary">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa nostrum
        laborum ea molestias corporis rerum iusto? Iure, sapiente velit? Alias
        possimus natus voluptas hic perferendis quae, consequuntur optio.
        Recusandae, atque?
      </p>
      <common.Table
        values={sections}
        tableColumns={[
          {
            name: 'name',
            displayName: 'Template name',
            handler: (value) =>
              value ? (
                <p
                  className={
                    value.type === 'title' ? 'font-semibold' : 'text-blue-500'
                  }
                >
                  {value.value}
                </p>
              ) : (
                ''
              )
          },
          {
            name: 'description',
            displayName: 'Description',
            handler: (value) => (value ? value : '')
          }
        ]}
        rounded
      />
    </div>
  )
}
