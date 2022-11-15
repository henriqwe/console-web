import { StepType } from '@reactour/tour'
import { TourStep } from 'common'

export const tourSteps: StepType[] = [
  {
    selector: '.database-step-1',
    content: (
      <TourStep
        title="Our Blog"
        content="Make sure to checkout our blog for the latest news, updates and tips from our team."
      />
    )
  },
  {
    selector: '.database-step-2',
    content: (
      <TourStep
        title="Publish Schema Version"
        content="Make sure the schema is not published before making any changes, and that it is published after making changes. You can do that by clicking here."
      />
    )
  },
  {
    selector: '.database-step-3',
    content: (
      <TourStep
        title="Create Entity"
        content="Click here to create a new entity."
      />
    )
  }
]
