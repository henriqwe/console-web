import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { RedOutline } from '.'

export default {
  title: 'Components/Button/RedOutline',
  component: RedOutline
} as ComponentMeta<typeof RedOutline>

const Template: ComponentStory<typeof RedOutline> = (args) => (
  <RedOutline {...args}>Children placeholder</RedOutline>
)

export const Default = Template.bind({})
Default.args = {}
