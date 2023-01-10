import { TourProvider } from '@reactour/tour'
import { Editors } from './Console'
import { Tour } from './Tour'
import { Buttons } from 'common'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid'

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
        prevButton={({ currentStep, setCurrentStep }) => (
          <Buttons.Ycodify
            onClick={() => setCurrentStep(currentStep - 1)}
            icon={<ArrowLeftIcon className="w-3 h-3" />}
            iconPosition="left"
            className="mr-2"
          ></Buttons.Ycodify>
        )}
        nextButton={({ steps, currentStep, setCurrentStep }) => {
          return (
            <Buttons.Ycodify
              onClick={() => setCurrentStep(currentStep + 1)}
              icon={<ArrowRightIcon className="w-3 h-3" />}
              className="ml-2 w-max"
            >
              {currentStep === steps!.length - 1 ? 'Finish' : ''}
            </Buttons.Ycodify>
          )
        }}
        showCloseButton={false}
        beforeClose={() =>
          window.localStorage.setItem('toured-dataapi', 'true')
        }
        onClickMask={() => {}}
      >
        <Tour />
        <div className="flex w-full h-full px-8 py-4 ">
          <Editors />
        </div>
      </TourProvider>
    </>
  )
}
