import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { User } from '.'

export default {
  title: 'Components/Illustrations',
  component: User
} as ComponentMeta<typeof User>

const Template: ComponentStory<typeof User> = (args) => <User />

export const Default = Template.bind({})
Default.args = {}
