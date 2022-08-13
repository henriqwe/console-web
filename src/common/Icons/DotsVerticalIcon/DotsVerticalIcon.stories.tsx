import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DotsVerticalIcon } from '.'

export default {
  title: 'Components/Icons/X',
  component: DotsVerticalIcon
} as ComponentMeta<typeof DotsVerticalIcon>

const Template: ComponentStory<typeof DotsVerticalIcon> = (args) => (
  <DotsVerticalIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
