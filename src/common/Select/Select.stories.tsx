import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Select } from '.'

const options = [
  { value: 1, name: 'Select 1' },
  { value: 2, name: 'Select 2' },
  { value: 3, name: 'Select 3' },
  { value: 4, name: 'Select 4' }
]

export default {
  title: 'Components/Select',
  component: Select
} as ComponentMeta<typeof Select>

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />

export const Default = Template.bind({})
Default.args = {
  options,
  label: 'Default Multi Select'
}

export const Disabled = Template.bind({})
Disabled.args = {
  options,
  label: 'Disabled Multi Select',
  disabled: true
}
