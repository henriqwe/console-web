import { Buttons } from 'common'
import React from 'react'

const plans = [
  {
    name: 'Free',
    price: 'R$0,00',
    description: 'Baixa escala',
    href: 'https://console.ycodify.com/register',
    features: [
      'Modelos: 10',
      'Franquia mensal: 500 MB',
      '60 requisições por minuto',
      'Suporte na comunidade',
      'SLA: 48h'
    ],
    detail: '',
    buttontext: 'Experimente'
  },
  {
    featured: true,
    name: 'Starter',
    price: 'R$149,97',
    description: 'Média escala',
    href: 'https://console.ycodify.com/register',
    features: [
      'Modelos de dados ilimitados',
      'Franquia mensal: 5 GB*',
      'Requisições ilimitadas',
      'Alta disponibilidade',
      'SLA: 95'
    ],
    detail: '*R$15,00 por GB adicional',
    buttontext: 'Contrate'
  },
  {
    name: 'Pro',
    price: 'R$349,97',
    description: 'Larga escala',
    href: 'https://console.ycodify.com/register',
    features: [
      'Modelos de dados ilimitados',
      'Modelagem Gráfica',
      'Franquia mensal: 15 GB',
      'Requisições ilimitadas',
      'Alta disponibilidade',
      'SLA: 97365'
    ],
    detail: '*R$15,00 por GB adicional',
    buttontext: 'Contrate'
  },
  {
    name: 'Enterprise',
    price: 'Sob medida',
    description: 'Infraestrutura dedicada',
    href: 'https://console.ycodify.com/register',
    features: [
      'Franquia personalizada',
      'Modelagem Gráfica',
      'Alta disponibilidade',
      'Single-Sign On',
      'Suporte dedicado'
    ],
    detail: '*R$15,00 por GB adicional',
    buttontext: 'Entre em contato'
  }
]

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
          <p className="px-1 text-sm text-text-tertiary">{description}</p>
        </div>

        <ul role="list" className="flex flex-col gap-y-2 text-sm">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex gap-x-2 text-slate-700 dark:text-text-secondary"
            >
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-y-4">
          <p className="mt-auto px-1 font-display text-xs text-text-tertiary">
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

export function Billing() {
  return (
    <div className="grid w-full grid-cols-1 gap-10 px-4 lg:grid-cols-4">
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
    </div>
  )
}
