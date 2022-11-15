import { StepType } from '@reactour/tour'
import { TourStep } from 'common'

export const tourSteps: StepType[] = [
  {
    selector: '.users-step-1',
    content: (
      <TourStep
        title="Users List"
        content="This is where you can manage the users of your schema. The created users will appear in the bottom of this section, where you can edit their status and roles later on."
      />
    )
  },
  {
    selector: '.users-step-2',
    content: (
      <TourStep
        title="Create User"
        content="Click here to create a new user. PS: Make sure you have at least one hole in your schema before you create a new user."
      />
    )
  },
  {
    selector: '.users-step-3',
    content: (
      <TourStep
        title="Associate User to Role"
        content="Click here to associate an existing user from another schema with a role."
      />
    )
  }
]
