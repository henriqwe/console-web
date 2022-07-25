import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Blue } from '.'

export default {
  title: 'Components/Button/Blue',
  component: Blue
} as ComponentMeta<typeof Blue>

const Template: ComponentStory<typeof Blue> = (args) => (
  <Blue {...args}>Children placeholder</Blue>
)

export const Default = Template.bind({})
Default.args = {}
