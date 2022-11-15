import { TourProvider } from '@reactour/tour'
import * as dashboard from 'domains/dashboard'
import { Tour } from 'domains/dashboard/Tour'
import { Buttons } from 'common'
import Head from 'next/head'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { ArrowRightIcon } from '@heroicons/react/solid'

export default function Dashboard() {
  return (
    <dashboard.DataProvider>
      <Page />
    </dashboard.DataProvider>
  )
}

function Page() {
  return (
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
      beforeClose={() => localStorage.setItem('toured-dashboard', 'true')}
      onClickMask={() => {}}
    >
      <Head>
        <title>Projects - Dashboard</title>
      </Head>
      <Tour />
      <dashboard.Template>
        <dashboard.Projects />
      </dashboard.Template>
    </TourProvider>
  )
}

// Admin user name: tester@test

// Admin password: xl75BQUEjkgMZVrp
