import { StepType } from '@reactour/tour'
import { TourStep } from 'common'

export const tourSteps: StepType[] = [
  {
    selector: '.modeler-step-1',
    content: (
      <TourStep
        title="Sidebar"
        content="This is the sidebar, where you can view and modify every aspect of your project."
      />
    )
  },
  {
    selector: '.modeler-step-2',
    content: (
      <TourStep
        title="Schema Manager"
        content="The Schema tab, where you can modify your project schema structure, manage users, etc."
      />
    )
  },
  {
    selector: '.modeler-step-3',
    content: (
      <TourStep
        title="Modeler"
        content="You are here. In this tab you can view and modify your schema structure using YCL language and graphic modeling."
      />
    )
  },
  {
    selector: '.modeler-step-4',
    content: (
      <TourStep
        title="YCL Modeler"
        content="This is where you can view and edit your schema in YCL."
      />
    )
  },
  {
    selector: '.modeler-step-5',
    content: (
      <TourStep
        title="Graphic Modeler"
        content="Here you can view and edit your schema with graphic modeling."
      />
    )
  }
]
