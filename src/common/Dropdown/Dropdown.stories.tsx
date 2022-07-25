import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Dropdown } from '.'

const actions = [
  { title: 'Action 1', onClick: () => {} },
  { title: 'Action 2', onClick: () => {} },
  { title: 'Action 3', onClick: () => {} },
  { title: 'Action 4', onClick: () => {} },
  { title: 'Action 5', onClick: () => {} }
]

export default {
  title: 'Components/Dropdown',
  component: Dropdown
} as ComponentMeta<typeof Dropdown>

const Template: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args}>Children is the dropdown text</Dropdown>
)

export const Default = Template.bind({})
Default.args = { actions }
