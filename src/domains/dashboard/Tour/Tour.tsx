import { useTour } from '@reactour/tour'
import { useLocalTour } from 'contexts/TourContext'
import { useEffect, useState } from 'react'
import { tourSteps } from '.'
import { Tour as TourIllustration } from 'common/Ilustrations/Tour'

export function Tour() {
  const [showGreeting, setShowGreeting] = useState(false)
  const { setSteps, setCurrentStep, setIsOpen } = useTour()
  const { getToured, setLocalToured } = useLocalTour()

  function handleDismiss() {
    setShowGreeting(false)
    setLocalToured('dashboard', true)
  }

  function handleContinue() {
    setShowGreeting(false)
    setIsOpen(true)
  }

  useEffect(() => {
    setIsOpen(false)
    setShowGreeting(!getToured().dashboard)
    setSteps(tourSteps)
    setCurrentStep(0)
  }, [])

  return showGreeting ? (
    <div className="z-[9999] absolute inset-0 bg-black/70 flex w-screen h-screen justify-center items-center px-10">
      <div className="bg-white shadow rounded-lg flex flex-col">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex gap-x-12">
            <div className="flex flex-col gap-y-10">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Welcome to your dashboard!
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    We have prepared a quick tour to help you understand what's
                    going on here.
                  </p>
                </div>
              </div>
              <div className="mt-auto flex gap-x-10 justify-between">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 sm:font-medium text-red-700 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
                >
                  I know what I'm doing
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex items-center rounded-md border border-transparent bg-yc px-4 py-2 sm:font-medium text-white shadow-sm hover:bg-yc-brighter focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
                >
                  Take the tour
                </button>
              </div>
            </div>
            <TourIllustration className="w-64 h-auto hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  ) : null
}
