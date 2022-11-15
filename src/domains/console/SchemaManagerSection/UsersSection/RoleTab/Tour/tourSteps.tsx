import { StepType } from '@reactour/tour'
import { TourStep } from 'common'

export const tourSteps: StepType[] = [
  {
    selector: '.roles-step-1',
    content: (
      <TourStep
        title="Role List"
        content="This is where you can manage your schema's roles. The created roles will appear in the bottom of this section, where you can edit their status later on."
      />
    )
  },
  {
    selector: '.roles-step-2',
    content: (
      <TourStep
        title="Create Role"
        content="Click here to create a new role."
      />
    )
  }
]
