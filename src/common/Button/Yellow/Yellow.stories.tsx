import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Yellow } from '.'

export default {
  title: 'Components/Button/Yellow',
  component: Yellow
} as ComponentMeta<typeof Yellow>

const Template: ComponentStory<typeof Yellow> = (args) => (
  <Yellow {...args}>Button</Yellow>
)

export const Default = Template.bind({})
Default.args = {}
