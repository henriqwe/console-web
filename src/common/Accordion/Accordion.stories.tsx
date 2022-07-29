import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Accordion } from '.'

const content = (
  <ul>
    <li className="mb-2">Content placeholder 1</li>
    <li className="mb-2">Content placeholder 2</li>
    <li className="mb-2">Content placeholder 3</li>
    <li className="mb-2">Content placeholder 4</li>
  </ul>
)

export default {
  title: 'Components/Accordion',
  component: Accordion
} as ComponentMeta<typeof Accordion>

const Template: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Accordion',
  defaultOpen: false,
  action: () => {},
  content,
  id: 0
}
