import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { EditIcon } from './EditIcon'

export default {
  title: 'Components/Icons/EditIcon',
  component: EditIcon
} as ComponentMeta<typeof EditIcon>

const Template: ComponentStory<typeof EditIcon> = (args) => (
  <EditIcon {...args} />
)

export const Default = Template.bind({})
Default.args = {}
