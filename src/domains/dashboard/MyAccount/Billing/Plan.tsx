import { Buttons } from 'common'

type PlanProps = {
  name: string
  price: string
  description: string
  href: string
  features: string[]
  detail: string
  selected?: boolean
}

export function Plan({
  name,
  price,
  description,
  href,
  features,
  detail,
  selected = false
}: PlanProps) {
  return (
    <div
      className={`w-max rounded-3xl p-[2px]
        ${
          selected
            ? 'order-first lg:order-none bg-gradient-to-r from-[#869700] via-[#b1c901] to-[#869700]'
            : 'bg-gray-300'
        }`}
    >
      <section
        className={`flex h-full flex-col gap-y-3 rounded-3xl bg-white dark:bg-menuItem-primary px-6 py-5 md:px-8 md:pt-2 md:pb-4`}
      >
        <h3 className="font-display text-md dark:text-text-primary">{name}</h3>

        <div className="font-display">
          <p className="text-3xl font-[350] tracking-tight 2xl:text-4xl dark:text-text-primary">
            {price}
          </p>
          <p className="px-1 text-sm text-text-secondary">{description}</p>
        </div>

        <ul role="list" className="flex flex-col gap-y-2 text-sm">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex gap-x-2 items-center text-slate-700 dark:text-text-primary"
            >
              <CheckIcon />
              <p>{feature}</p>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-y-4">
          <p className="mt-auto px-1 font-display text-xs text-text-secondary">
            {detail}
          </p>
          <a href={href}>
            {selected ? (
              <Buttons.Ycodify className="w-full dark:text-text-primary">
                Selected
              </Buttons.Ycodify>
            ) : (
              <Buttons.Clean className="w-full dark:text-text-primary">
                Change
              </Buttons.Clean>
            )}
          </a>
        </div>
      </section>
    </div>
  )
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
