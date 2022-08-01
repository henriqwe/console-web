import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { AccordionGroup } from '.'

const content = (
  <ul>
    <li className="mb-2">Content placeholder 1</li>
    <li className="mb-2">Content placeholder 2</li>
    <li className="mb-2">Content placeholder 3</li>
    <li className="mb-2">Content placeholder 4</li>
  </ul>
)

const accordions = [
  { id: 1, title: 'title 1', content, defaultOpen: false, action: () => {} },
  { id: 2, title: 'title 2', content, defaultOpen: false, action: () => {} },
  { id: 3, title: 'title 3', content, defaultOpen: false, action: () => {} },
  { id: 4, title: 'title 4', content, defaultOpen: false, action: () => {} },
  { id: 5, title: 'title 5', content, defaultOpen: false, action: () => {} }
]

export default {
  title: 'Components/AccordionGroup',
  component: AccordionGroup
} as ComponentMeta<typeof AccordionGroup>

const Template: ComponentStory<typeof AccordionGroup> = (args) => (
  <AccordionGroup {...args} />
)

export const Default = Template.bind({})
Default.args = {
  accordionsData: accordions,
  hideSelf: false
}

export const HideSelf = Template.bind({})
HideSelf.args = {
  accordionsData: accordions,
  hideSelf: true
}
