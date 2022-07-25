import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { GreenOutline } from '.'

export default {
  title: 'Components/Button/GreenOutline',
  component: GreenOutline
} as ComponentMeta<typeof GreenOutline>

const Template: ComponentStory<typeof GreenOutline> = (args) => (
  <GreenOutline {...args}>Button</GreenOutline>
)

export const Default = Template.bind({})
Default.args = {}
