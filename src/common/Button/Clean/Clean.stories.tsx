import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Clean } from '.'

export default {
  title: 'Components/Button/Clean',
  component: Clean
} as ComponentMeta<typeof Clean>

const Template: ComponentStory<typeof Clean> = (args) => (
  <Clean {...args}>Children placeholder</Clean>
)

export const Default = Template.bind({})
Default.args = {}
