import { Plan } from './Plan'
import React, { useEffect, useState } from 'react'
import * as Common from 'common'
import { plans } from './plans'

export function Billing() {
  const [loading, setLoading] = useState(true)
  const [billingHistory, setBillingHistory] = useState<{projectName: string}[]>([])

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
    <div className="flex flex-col px-4 gap-y-8">
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
      <span className="w-full mt-4 border-b border-gray-300 dark:border-gray-600" />
      <section className="flex flex-col gap-y-8">
        <p className="text-2xl font-semibold dark:text-text-primary text-slate-900">
          Billing history
        </p>

        <div className="flex items-center justify-center w-full">
          {loading ? (
            <Common.Spinner className="w-8 h-8 dark:text-text-primary" />
          ) :
          //  billingHistory.length ? (
          //   billingHistory.map((item) => (
          //     <p key={item.projectName}>{item.projectName}</p>
          //   ))
          // ) : 
          (
            <span className="flex flex-col items-center h-auto gap-y-6 w-80">
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
