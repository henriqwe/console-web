import { TourProvider } from '@reactour/tour'
import { Editors } from './Console'
import { Tour } from './Tour'

export function DataApiSection() {
  return (
    <>
      <TourProvider
        steps={[]}
        styles={{
          popover: (base) => ({
            ...base,
            '--reactour-accent': '#0cd664',
            borderRadius: 10
          }),
          dot: (base, { current }: any) => ({
            ...base,
            backgroundColor: current ? '#0cd664' : '#ccc'
          })
        }}
        beforeClose={() =>
          window.localStorage.setItem('toured-dataapi', 'true')
        }
      >
        <Tour />
        <div className="flex w-full h-full py-4 px-8 ">
          <Editors />
        </div>
      </TourProvider>
    </>
  )
}
