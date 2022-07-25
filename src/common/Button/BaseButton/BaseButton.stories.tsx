import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { BaseButton } from '.'

export default {
  title: 'Components/Button/BaseButton',
  component: BaseButton
} as ComponentMeta<typeof BaseButton>

const Template: ComponentStory<typeof BaseButton> = (args) => (
  <BaseButton {...args}>Button</BaseButton>
)

export const Default = Template.bind({})
Default.args = {}
