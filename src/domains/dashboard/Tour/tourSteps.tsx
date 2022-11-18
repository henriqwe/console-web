import { StepType } from '@reactour/tour'
import { TourStep } from 'common'

export const tourSteps: StepType[] = [
  {
    selector: '.dashboard-step-1',
    content: (
      <TourStep
        title="Dashboard"
        content="This is the sidebar, where you can access the available pages."
      />
    )
  },
  {
    selector: '.dashboard-step-2',
    content: <TourStep title="Projects" content="You are here." />
  },
  {
    selector: '.dashboard-step-3',
    content: (
      <TourStep
        title="Tutorials And Docs"
        content="This is where you can find more information about the platform and how to use it."
      />
    )
  },
  {
    selector: '.dashboard-step-4',
    content: (
      <TourStep
        title="Help And Support"
        content="Create and access support tickets."
      />
    )
  },
  {
    selector: '.dashboard-step-5',
    content: (
      <TourStep
        title="My Account"
        content="Access and edit your password and billing address information. You can also change your plan and view your current and past invoices."
      />
    )
  },
  {
    selector: '.dashboard-step-6',
    content: (
      <TourStep
        title="Project List"
        content="This is the main part, where you can create and manage your projects."
      />
    )
  },
  {
    selector: '.dashboard-step-7',
    content: (
      <TourStep
        title="Search for projects"
        content="Filter your projects by name."
      />
    )
  },
  {
    selector: '.dashboard-step-8',
    content: (
      <TourStep
        title="New Project"
        content="Create a new project by clicking here."
      />
    )
  }
]
