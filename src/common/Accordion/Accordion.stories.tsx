import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Accordion } from '.'

const content = (
  <ul>
    <li>Content placeholder 1</li>
    <li>Content placeholder 2</li>
    <li>Content placeholder 3</li>
    <li>Content placeholder 4</li>
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
  titles: 'Accordion',
  content
}
