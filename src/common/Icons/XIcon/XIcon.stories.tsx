import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { XIcon } from '.'

export default {
  title: 'Components/Icons/X',
  component: XIcon
} as ComponentMeta<typeof XIcon>

const Template: ComponentStory<typeof XIcon> = (args) => <XIcon {...args} />

export const Default = Template.bind({})
Default.args = {}
