import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ConsoleIcon } from '.'

export default {
  title: 'Components/Icons/ConsoleIcon',
  component: ConsoleIcon
} as ComponentMeta<typeof ConsoleIcon>

const Template: ComponentStory<typeof ConsoleIcon> = (args) => (
  <ConsoleIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
