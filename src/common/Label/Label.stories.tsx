import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Label } from '.'

export default {
  title: 'Components/Label',
  component: Label
} as ComponentMeta<typeof Label>

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Small = Template.bind({})
Small.args = {
  text: 'Label',
  size: 'small'
}

export const Medium = Template.bind({})
Medium.args = {
  text: 'Label',
  size: 'medium'
}

export const Large = Template.bind({})
Large.args = {
  text: 'Label',
  size: 'large'
}
