import * as utils from 'utils'
import * as common from 'common'
import * as consoleSection from 'domains/console'
import { useEffect, useId, useState } from 'react'
import { useRouter } from 'next/router'
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/solid'
import { Tour } from './Tour'
import { TourProvider } from '@reactour/tour'

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
    <>
      <Tour />
      <div className="database-step-1 flex flex-col w-full h-full p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Publish console version</p>
            <p className="text-sm text-gray-600 dark:text-text-tertiary">
              Active the toggle button to publish all modifications in a new
              version
            </p>
          </div>
          <div className="database-step-2 flex gap-2">
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
        <div className="mx-auto max-w-7xl py-12">
          <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg lg:grid lg:grid-cols-2 lg:gap-4 relative">
            <Waveform className="absolute inset-0 h-20 w-full -top-2" />
            <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-bold tracking-tight dark:text-text-primary sm:text-4xl">
                  <span className="block">Ycodify Blog</span>
                </h2>
                <p className="mt-4 text-lg leading-6 dark:text-text-secondary">
                  Updates on Ycodify platform services, information on BaaS and
                  news from the world of programming.
                </p>
                <common.Buttons.Ycodify
                  className="mt-8"
                  icon={<ArrowRightIcon className="w-5 h-5" />}
                >
                  <a
                    className="text-lg font-semibold py-1"
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://www.blog.codify.com/"
                  >
                    Check it out
                  </a>
                </common.Buttons.Ycodify>
              </div>
            </div>
            <img
              className="translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-12"
              src="/assets/images/blog.png"
            />
          </div>
        </div>
      </div>
    </>
  )
}

function Waveform({ ...props }) {
  let id = useId()
  let bars = {
    total: 100,
    width: 2,
    gap: 2,
    minHeight: 40,
    maxHeight: 100
  }

  let barHeights = Array.from(
    { length: bars.total },
    randomBetween(bars.minHeight, bars.maxHeight)
  )

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="40%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
        <linearGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="#4989E8" />
          <stop offset="50%" stopColor="#6159DA" />
          <stop offset="100%" stopColor="#FF54AD" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
        </mask>
        <pattern
          id={`${id}-pattern`}
          width={bars.total * bars.width + bars.total * bars.gap}
          height="100%"
          patternUnits="userSpaceOnUse"
        >
          {Array.from({ length: bars.total }, (_, index) => (
            <rect
              key={index}
              width={bars.width}
              height={`${barHeights[index]}%`}
              x={bars.gap * (index + 1) + bars.width * index}
              fill={`url(#${id}-fade)`}
            />
          ))}
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id}-gradient)`}
        mask={`url(#${id}-mask)`}
        opacity="0.25"
      />
    </svg>
  )
}

function randomBetween(min: number, max: number, seed = 1) {
  return () => {
    let rand = Math.sin(seed++) * 10000
    rand = rand - Math.floor(rand)
    return Math.floor(rand * (max - min + 1) + min)
  }
}
