import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { BlueOutline } from '.'

export default {
  title: 'Components/Button/BlueOutline',
  component: BlueOutline
} as ComponentMeta<typeof BlueOutline>

const Template: ComponentStory<typeof BlueOutline> = (args) => (
  <BlueOutline {...args}>Button</BlueOutline>
)

export const Default = Template.bind({})
Default.args = {}
