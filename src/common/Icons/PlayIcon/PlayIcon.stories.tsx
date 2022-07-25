import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { PlayIcon } from '.'

export default {
  title: 'Components/Icons/PlayIcon',
  component: PlayIcon
} as ComponentMeta<typeof PlayIcon>

const Template: ComponentStory<typeof PlayIcon> = (args) => (
  <PlayIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
