import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { MultiSelect } from '.'

const options = [
  { value: 1, name: 'Select 1' },
  { value: 2, name: 'Select 2' },
  { value: 3, name: 'Select 3' },
  { value: 4, name: 'Select 4' }
]

export default {
  title: 'Components/MultiSelect',
  component: MultiSelect
} as ComponentMeta<typeof MultiSelect>

const Template: ComponentStory<typeof MultiSelect> = (args) => (
  <MultiSelect {...args} />
)

export const Default = Template.bind({})
Default.args = {
  options,
  label: 'Default Multi Select',
  disabled: false,
  edit: false
}

export const Disabled = Template.bind({})
Disabled.args = {
  options,
  label: 'Multi Select Label',
  disabled: true,
  edit: false
}
