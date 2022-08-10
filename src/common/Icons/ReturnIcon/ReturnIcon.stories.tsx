import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ReturnIcon } from '.'

export default {
  title: 'Components/Icons/Return',
  component: ReturnIcon
} as ComponentMeta<typeof ReturnIcon>

const Template: ComponentStory<typeof ReturnIcon> = (args) => (
  <ReturnIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
