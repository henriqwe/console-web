import { BillingCard, BillingCardProps } from './BillingCard'
import { Plan } from './Plan'
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
      'SLA: 48h to reply'
    ],
    detail: ''
  },
  {
    selected: true,
    name: 'Starter',
    price: 'R$149,97',
    description: 'Medium scale',
    href: 'https://console.ycodify.com/register',
    features: [
      'Unlimited data models',
      'Monthly deductible: 5 GB*',
      'Unlimited requests',
      'High availability',
      'SLA: Business Hours'
    ],
    detail: '*R$15,00 per additional GB'
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
      'SLA: 9*7*365'
    ],
    detail: '*R$15,00 per additional GB'
  },
  {
    name: 'Enterprise',
    price: 'Custom made',
    description: 'Dedicated infrastructure',
    href: 'https://console.ycodify.com/register',
    features: [
      'Personalized franchise',
      'Graphic modeling',
      'High availability',
      'Single-Sign On',
      'Dedicated support'
    ],
    detail: '*R$15,00 per additional GB'
  }
]

export function Billing() {
  const [loading, setLoading] = useState(true)
  const [billingHistory, setBillingHistory] = useState<BillingCardProps[]>([])

  useEffect(() => {
    //requisição pra pegar o plano atual e o histórico de faturas

    //setar os estados

    //renderizar como selected o plano atual do usuário

    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])
  return (
    <div className="flex flex-col gap-y-8 px-4">
      <section className="grid w-max self-center grid-cols-1 gap-10 lg:grid-cols-4">
        {plans.map(
          (
            { selected, name, price, description, href, features, detail },
            index
          ) => (
            <Plan
              key={index}
              selected={selected}
              name={name}
              price={price}
              description={description}
              href={href}
              features={features}
              detail={detail}
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
              <p className="dark:text-text-primary">
                Billing history not found
              </p>
            </span>
          )}
        </div>
      </section>
    </div>
  )
}
