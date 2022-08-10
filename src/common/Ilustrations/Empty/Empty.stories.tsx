import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Empty } from '..'

export default {
  title: 'Components/Illustrations',
  component: Empty
} as ComponentMeta<typeof Empty>

const Template: ComponentStory<typeof Empty> = (args) => <Empty />

export const Default = Template.bind({})
Default.args = {}
