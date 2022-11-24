import { BillingCard, BillingCardProps } from './BillingCard'
import { Plan } from './Plan'
import React, { useEffect, useState } from 'react'
import * as Common from 'common'
import { plans } from './plans'
import { useUser } from 'contexts/UserContext'

export function Billing() {
  const [loading, setLoading] = useState(true)
  const [billingHistory, setBillingHistory] = useState<BillingCardProps[]>([])

  // temporariamente enquanto não vem do backend
  // const { selectedPlan } = user?.userData
  const selectedPlan = 'Free'

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
      <section className="grid self-center grid-cols-1 gap-10 lg:grid-cols-2 2xl:grid-cols-4">
        {plans.map(
          ({ name, price, description, href, features, detail }, index) => (
            <Plan
              key={index}
              name={name}
              price={price}
              description={description}
              href={href}
              features={features}
              detail={detail}
              selectedPlan={selectedPlan === name}
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
