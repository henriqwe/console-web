import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { CodeSquareIcon } from '.'

export default {
  title: 'Components/Icons/CodeSquare',
  component: CodeSquareIcon
} as ComponentMeta<typeof CodeSquareIcon>

const Template: ComponentStory<typeof CodeSquareIcon> = (args) => (
  <CodeSquareIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
