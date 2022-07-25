import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Red } from '.'

export default {
  title: 'Components/Button/Red',
  component: Red
} as ComponentMeta<typeof Red>

const Template: ComponentStory<typeof Red> = (args) => (
  <Red {...args}>Children placeholder</Red>
)

export const Default = Template.bind({})
Default.args = {}
