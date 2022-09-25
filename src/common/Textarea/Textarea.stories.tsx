import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Textarea } from '.'

export default {
  title: 'Components/Textarea',
  component: Textarea
} as ComponentMeta<typeof Textarea>

const Template: ComponentStory<typeof Textarea> = (args) => <Textarea {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Text Textarea',
  type: 'text'
}

export const Email = Template.bind({})
Email.args = {
  label: 'Email Textarea',
  type: 'email'
}

export const Button = Template.bind({})
Button.args = {
  label: 'Button Textarea',
  type: 'button'
}

export const Date = Template.bind({})
Date.args = {
  label: 'Date Textarea',
  type: 'date'
}

export const File = Template.bind({})
File.args = {
  label: 'File Textarea',
  type: 'file'
}

export const Image = Template.bind({})
Image.args = {
  label: 'Image Textarea',
  type: 'image'
}

export const Range = Template.bind({})
Range.args = {
  label: 'Range Textarea',
  type: 'range'
}

export const Submit = Template.bind({})
Submit.args = {
  label: 'Submit Textarea',
  type: 'submit'
}
