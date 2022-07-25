import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Green } from '.'

export default {
  title: 'Components/Button/Green',
  component: Green
} as ComponentMeta<typeof Green>

const Template: ComponentStory<typeof Green> = (args) => (
  <Green {...args}>Children placeholder</Green>
)

export const Default = Template.bind({})
Default.args = {}
