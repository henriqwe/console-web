import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { YellowOutline } from '.'

export default {
  title: 'Components/Button/YellowOutline',
  component: YellowOutline
} as ComponentMeta<typeof YellowOutline>

const Template: ComponentStory<typeof YellowOutline> = (args) => (
  <YellowOutline {...args}>Children placeholder</YellowOutline>
)

export const Default = Template.bind({})
Default.args = {}
