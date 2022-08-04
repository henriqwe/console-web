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
  disabled: false,
  options,
  label: 'Default Select',
  placeholder: 'Select an option'
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  options,
  label: 'Disabled Select',
  placeholder: 'Select an option'
}
