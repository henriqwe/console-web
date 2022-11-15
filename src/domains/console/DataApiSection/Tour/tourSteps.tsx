import { StepType } from '@reactour/tour'
import { TourStep } from 'common'

export const tourSteps: StepType[] = [
  {
    selector: '.dataapi-step-1',
    content: (
      <TourStep
        title="Data API"
        content="Once you have at least one entity created, the entities are gonna be listed here. You can click on any of them to see their properties and select which ones you want to include in the request."
      />
    )
  },
  {
    selector: '.dataapi-step-2',
    content: (
      <TourStep
        title="Select Operation"
        content="By clicking here you can choose which operation you want to perform on the selected entity and it's selected properties."
      />
    )
  },
  {
    selector: '.dataapi-step-3',
    content: (
      <TourStep
        title="Data API Console"
        content="The base request code with the selected entity and properties is gonna be shown here."
      />
    )
  },
  {
    selector: '.dataapi-step-4',
    content: (
      <TourStep
        title="Execute Request"
        content="Once you have the request code, you can click here to execute it."
      />
    )
  },
  {
    selector: '.dataapi-step-5',
    content: (
      <TourStep
        title="Request Response"
        content="The response from the request is gonna be shown here in JSON format."
      />
    )
  },
  {
    selector: '.dataapi-step-6',
    content: (
      <TourStep
        title="Show JavaScript Code"
        content="By clicking here you can see the JavaScript code for the request you've just executed, ready to be copied and used in your application"
      />
    )
  },
  {
    selector: '.dataapi-step-7',
    content: (
      <TourStep
        title="Endpoint and Headers"
        content="The endpoint and request headers can be seen here."
      />
    )
  }
]
