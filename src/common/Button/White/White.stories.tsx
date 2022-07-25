import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { White } from '.'

export default {
  title: 'Components/Button/White',
  component: White
} as ComponentMeta<typeof White>

const Template: ComponentStory<typeof White> = (args) => (
  <White {...args}>Button</White>
)

export const Default = Template.bind({})
Default.args = {}
