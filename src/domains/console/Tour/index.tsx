import { useState } from 'react'
import { TourProvider, useTour } from '@reactour/tour'

const stepStyle = { color: '#5ae' }

function Paragraphs() {
  const { setIsOpen, ...rest } = useTour()
  return (
    <div>
      <p>
        <span data-tour="step-1" style={stepStyle}>
          Lorem ipsum
        </span>{' '}
        dolor sit amet, consectetur adipiscing elit. Vivamus volutpat quam eu
        mauris euismod imperdiet. Nullam elementum fermentum neque a placerat.
        Vivamus sed dui nisi. Phasellus vel dolor interdum, accumsan eros ut,
        rutrum dolor.{' '}
        <span data-tour="step-2" style={stepStyle}>
          Pellentesque a magna enim. Pellentesque malesuada egestas urna, et
          pulvinar lorem viverra suscipit.
        </span>
        Duis sit amet mauris ante. Fusce at ante nunc. Maecenas ut leo eu erat porta
        fermentum.
      </p>{' '}
      <button onClick={() => setIsOpen(true)}>Open</button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet.{' '}
        <span data-tour="step-3" style={stepStyle}>
          Vivamus sed dui nisi. Phasellus vel dolor interdum,
        </span>
        Ut augue massa, aliquam in bibendum sed, euismod vitae magna. Nulla sit amet
        sodales augue. Curabitur in nulla in magna luctus porta et sit amet dolor.
        Pellentesque a magna enim.
      </p>
    </div>
  )
}

const steps = [
  {
    selector: '[data-tour="step-1"]',
    content: <p>Lorem ipsum dolor sit amet</p>,
  },
  {
    selector: '[data-tour="step-2"]',
    content: <p>consectetur adipiscing elit</p>,
  },
  {
    selector: '[data-tour="step-3"]',
    content: <p>Vivamus sed dui nisi</p>,
  },
]
;<>
  <TourProvider steps={steps}>
    <Paragraphs />
  </TourProvider>
</>