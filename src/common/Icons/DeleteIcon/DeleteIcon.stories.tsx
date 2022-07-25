import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DeleteIcon } from '.'

export default {
  title: 'Components/Icons/DeleteIcon',
  component: DeleteIcon
} as ComponentMeta<typeof DeleteIcon>

const Template: ComponentStory<typeof DeleteIcon> = (args) => (
  <DeleteIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
