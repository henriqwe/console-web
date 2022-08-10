import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ToggleTheme } from '.'

export default {
  title: 'Components/ToggleTheme',
  component: ToggleTheme
} as ComponentMeta<typeof ToggleTheme>

const template: ComponentStory<typeof ToggleTheme> = (args) => (
  <ToggleTheme {...args} />
)

export const Default = template.bind({})
Default.args = {
  changeColor: true
}

export const NoColorChange = template.bind({})
NoColorChange.args = {
  changeColor: false
}
