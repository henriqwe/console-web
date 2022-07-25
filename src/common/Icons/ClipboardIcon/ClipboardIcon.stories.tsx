import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ClipboardIcon } from '.'

export default {
  title: 'Components/Icons/Clipboard',
  component: ClipboardIcon
} as ComponentMeta<typeof ClipboardIcon>

const Template: ComponentStory<typeof ClipboardIcon> = (args) => (
  <ClipboardIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
