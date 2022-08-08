import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { BaseButton } from '.'

export default {
  title: 'Components/Button',
  component: BaseButton
} as ComponentMeta<typeof BaseButton>

const Template: ComponentStory<typeof BaseButton> = (args) => (
  <BaseButton {...args}>Button</BaseButton>
)

export const Default = Template.bind({})
Default.args = {
  buttonColor: '',
  hoverButtonColor: '',
  disableButtonColor: ''
}

export const Blue = Template.bind({})
Blue.args = {
  buttonColor: 'bg-blue-500',
  hoverButtonColor: 'hover:bg-blue-600',
  disableButtonColor: 'disabled:bg-blue-400',
  textColor: 'text-white'
}

export const BlueOutline = Template.bind({})
BlueOutline.args = {
  buttonColor: 'border-2 border-blue-500',
  hoverButtonColor: 'hover:bg-blue-600 hover:text-white',
  disableButtonColor: 'disabled:bg-blue-400',
  textColor: 'text-blue-500'
}

export const Green = Template.bind({})
Green.args = {
  buttonColor: 'bg-lime-400',
  hoverButtonColor: 'hover:bg-lime-500',
  disableButtonColor: 'disabled:bg-lime-600',
  textColor: 'text-gray-800'
}

export const GreenOutline = Template.bind({})
GreenOutline.args = {
  buttonColor: 'border-2 border-lime-500',
  hoverButtonColor: 'hover:bg-lime-600 hover:text-white',
  disableButtonColor: 'disabled:bg-lime-400',
  textColor: 'text-lime-500'
}

export const Red = Template.bind({})
Red.args = {
  buttonColor: 'bg-red-500',
  hoverButtonColor: 'hover:bg-red-600',
  disableButtonColor: 'disabled:bg-red-400',
  textColor: 'text-white'
}

export const RedOutline = Template.bind({})
RedOutline.args = {
  buttonColor: 'border-2 border-red-500',
  hoverButtonColor: 'hover:bg-red-600  hover:text-white',
  disableButtonColor: 'disabled:bg-red-400',
  textColor: 'text-red-500'
}

export const White = Template.bind({})
White.args = {
  buttonColor: 'bg-white',
  hoverButtonColor: 'hover:bg-gray-50',
  disableButtonColor: 'disabled:bg-gray-200',
  textColor: 'text-gray-800'
}

export const WhiteOutline = Template.bind({})
WhiteOutline.args = {
  buttonColor: 'bg-white border-2 border-gray-300',
  hoverButtonColor: 'hover:bg-gray-50',
  disableButtonColor: 'disabled:bg-gray-200',
  textColor: 'text-gray-800'
}

export const Yellow = Template.bind({})
Yellow.args = {
  buttonColor: 'bg-yellow-300',
  hoverButtonColor: 'hover:bg-yellow-400',
  disableButtonColor: 'disabled:bg-yellow-200',
  textColor: 'text-gray-800'
}

export const YellowOutline = Template.bind({})
YellowOutline.args = {
  buttonColor: 'border-2 border-yellow-500',
  hoverButtonColor: 'hover:bg-yellow-600  hover:text-white',
  disableButtonColor: 'disabled:bg-yellow-400',
  textColor: 'text-yellow-500'
}
