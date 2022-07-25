import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ListRadioGroup } from '.'

const options = [
  { value: '1', content: <p>Opção 1</p> },
  { value: '2', content: <p>Opção 2</p> },
  { value: '3', content: <p>Opção 3</p> },
  { value: '4', content: <p>Opção 4</p> }
]

export default {
  title: 'Components/ListRadioGroup',
  component: ListRadioGroup
} as ComponentMeta<typeof ListRadioGroup>

const Template: ComponentStory<typeof ListRadioGroup> = (args) => (
  <ListRadioGroup {...args}>Children placeholder</ListRadioGroup>
)

export const Default = Template.bind({})
Default.args = {
  options: options
}

export const Horizontal = Template.bind({})
Horizontal.args = {
  options: options,
  horizontal: true
}

export const Disabled = Template.bind({})
Disabled.args = {
  options: options,
  disabled: true
}

export const Compact = Template.bind({})
Compact.args = {
  options: options,
  compact: true
}

export const NoCheckboxIcon = Template.bind({})
NoCheckboxIcon.args = {
  options: options,
  disabledCheckBoxIcon: true
}

export const NoCheckIcon = Template.bind({})
NoCheckIcon.args = {
  options: options,
  showCheckIcon: false
}
