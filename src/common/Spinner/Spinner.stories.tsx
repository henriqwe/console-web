import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Spinner } from '.'

export default {
  title: 'Components/Spinner',
  component: Spinner
} as ComponentMeta<typeof Spinner>

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />

export const Default = Template.bind({})
Default.args = {
  className: 'dark:text-text-primary w-16'
}
