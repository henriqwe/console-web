import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DownloadIcon } from '.'

export default {
  title: 'Components/Icons/Delete',
  component: DownloadIcon
} as ComponentMeta<typeof DownloadIcon>

const Template: ComponentStory<typeof DownloadIcon> = (args) => (
  <DownloadIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
