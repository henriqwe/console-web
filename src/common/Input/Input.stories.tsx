import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Input } from '.'

export default {
  title: 'Components/Input',
  component: Input
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Email = Template.bind({})
Email.args = {
  label: 'Email input',
  type: 'email'
}

export const Button = Template.bind({})
Button.args = {
  label: 'Button input',
  type: 'button'
}

export const Date = Template.bind({})
Date.args = {
  label: 'Date input',
  type: 'date'
}

export const File = Template.bind({})
File.args = {
  label: 'File input',
  type: 'file'
}

export const Image = Template.bind({})
Image.args = {
  label: 'Image input',
  type: 'image'
}

export const Range = Template.bind({})
Range.args = {
  label: 'Range input',
  type: 'range'
}

export const Submit = Template.bind({})
Submit.args = {
  label: 'Submit input',
  type: 'submit'
}
