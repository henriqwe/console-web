import { Buttons } from 'common'
import React, { useEffect, useState } from 'react'
import * as Common from 'common'

const plans = [
  {
    name: 'Free',
    price: 'R$0,00',
    description: 'Low scale',
    href: 'https://console.ycodify.com/register',
    features: [
      'Models: 10',
      'Monthly deductible: 500 MB',
      '60 requests per minute',
      'Community support',
      'SLA: 48h'
    ],
    detail: '',
    buttontext: 'Try out'
  },
  {
    featured: true,
    name: 'Starter',
    price: 'R$149,97',
    description: 'Medium scale',
    href: 'https://console.ycodify.com/register',
    features: [
      'Unlimited data models',
      'Monthly deductible: 5 GB*',
      'Unlimited requests',
      'High availability',
      'SLA: 95'
    ],
    detail: '*R$15,00 per additional GB',
    buttontext: 'Hire'
  },
  {
    name: 'Pro',
    price: 'R$349,97',
    description: 'Large scale',
    href: 'https://console.ycodify.com/register',
    features: [
      'Unlimited data models',
      'Graphic modeling',
      'Monthly deductible: 15 GB',
      'Unlimited requests',
      'High availability',
      'SLA: 97365'
    ],
    detail: '*R$15,00 per additional GB',
    buttontext: 'Hire'
  },
  {
    name: 'Enterprise',
    price: 'Sob medida',
    description: 'Dedicated infrastructure',
    href: 'https://console.ycodify.com/register',
    features: [
      'Personalized franchise',
      'Graphic modeling',
      'High availability',
      'Single-Sign On',
      'Dedicated support'
    ],
    detail: '*R$15,00 per additional GB',
    buttontext: 'Contact us'
  }
]

type BillingCardProps = {
  projectName: String
}

export function Billing() {
  const [loading, setLoading] = useState(true)
  const [billingHistory, setBillingHistory] = useState<BillingCardProps[]>([])

  useEffect(() => {
    //requisição pra pegar o plano atual e o histórico de faturas

    //setar os estados

    //renderizar como featured o plano atual do usuário

    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])
  return (
    <div className="flex flex-col gap-y-8 px-4">
      <section className="grid w-full grid-cols-1 gap-10 lg:grid-cols-4">
        {plans.map(
          (
            {
              featured,
              name,
              price,
              description,
              href,
              features,
              detail,
              buttontext
            },
            index
          ) => (
            <Plan
              key={index}
              featured={featured}
              name={name}
              price={price}
              description={description}
              href={href}
              features={features}
              detail={detail}
              buttontext={buttontext}
            />
          )
        )}
      </section>
      <span className="w-full border-b border-gray-300 mt-4 dark:border-gray-600" />
      <section className="flex flex-col gap-y-8">
        <p className="text-2xl font-semibold dark:text-text-primary text-slate-900">
          Billing history
        </p>

        <div className="flex w-full items-center justify-center">
          {loading ? (
            <Common.Spinner className="dark:text-text-primary w-8 h-8" />
          ) : billingHistory.length ? (
            billingHistory.map((item, index) => (
              <BillingCard key={index} projectName={item.projectName} />
            ))
          ) : (
            <span className="flex items-center flex-col gap-y-6 w-80 h-auto">
              <Common.illustrations.Empty />
              <p className="text-text-primary">Billing history not found</p>
            </span>
          )}
        </div>
      </section>
    </div>
  )
}

function BillingCard({ projectName }: BillingCardProps) {
  return <p>{projectName}</p>
}

type CheckIconProps = {
  className?: string
}

function CheckIcon({ className }: CheckIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`
        h-6 w-6 flex-none fill-current stroke-current
        ${className}`}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type PlanProps = {
  name: string
  price: string
  description: string
  href: string
  features: string[]
  detail: string
  buttontext: string
  featured?: boolean
}

function Plan({
  name,
  price,
  description,
  href,
  features,
  detail,
  buttontext,
  featured = false
}: PlanProps) {
  return (
    <div
      className={`rounded-3xl p-[2px]
        ${
          featured
            ? 'order-first lg:order-none bg-gradient-to-r from-[#869700] via-[#b1c901] to-[#869700]'
            : 'bg-gray-300'
        }`}
    >
      <section
        className={`flex h-full flex-col gap-y-5 rounded-3xl bg-white dark:bg-menuItem-primary px-6 py-5 sm:px-8 md:pt-8 md:pb-5`}
      >
        <h3 className="font-display text-lg dark:text-text-primary">{name}</h3>

        <div className="font-display">
          <p className=" text-4xl font-light tracking-tight 2xl:text-5xl dark:text-text-primary">
            {price}
          </p>
          <p className="px-1 text-sm text-text-secondary">{description}</p>
        </div>

        <ul role="list" className="flex flex-col gap-y-2 text-sm">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex gap-x-2 text-slate-700 dark:text-text-primary"
            >
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-y-4">
          <p className="mt-auto px-1 font-display text-xs text-text-secondary">
            {detail}
          </p>
          <a href={href}>
            {featured ? (
              <Buttons.Ycodify className="w-full dark:text-text-primary">
                {buttontext}
              </Buttons.Ycodify>
            ) : (
              <Buttons.Clean className="w-full dark:text-text-primary">
                {buttontext}
              </Buttons.Clean>
            )}
          </a>
        </div>
      </section>
    </div>
  )
}
