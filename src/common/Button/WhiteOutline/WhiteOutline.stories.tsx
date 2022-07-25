import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { WhiteOutline } from '.'

export default {
  title: 'Components/Button/WhiteOutline',
  component: WhiteOutline
} as ComponentMeta<typeof WhiteOutline>

const Template: ComponentStory<typeof WhiteOutline> = (args) => (
  <WhiteOutline {...args}>Children placeholder</WhiteOutline>
)

export const Default = Template.bind({})
Default.args = {}
