import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JavaScriptIcon } from '.'

export default {
  title: 'Components/Icons/JavaScriptIcon',
  component: JavaScriptIcon
} as ComponentMeta<typeof JavaScriptIcon>

const Template: ComponentStory<typeof JavaScriptIcon> = (args) => (
  <JavaScriptIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
