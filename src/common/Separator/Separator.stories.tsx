import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Separator } from '.'

const options = [
  { value: 1, name: 'Select 1' },
  { value: 2, name: 'Select 2' },
  { value: 3, name: 'Select 3' },
  { value: 4, name: 'Select 4' }
]

export default {
  title: 'Components/Separator',
  component: Separator
} as ComponentMeta<typeof Separator>

const Template: ComponentStory<typeof Separator> = (args) => (
  <div>
    <p>Item 1</p>
    <Separator {...args} />
    <p>Item 2</p>
    <Separator {...args} />
    <p>Item 2</p>
    <Separator {...args} />
    <p>Item 2</p>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  className: ''
}

export const RedExample = Template.bind({})
RedExample.args = {
  className: 'border-red-500'
}

export const OpacityExample = Template.bind({})
OpacityExample.args = {
  className: 'border-purple-600/40'
}
