import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ClearModal } from '.'

export default {
  title: 'Components/ClearMoal',
  component: ClearModal
} as ComponentMeta<typeof ClearModal>

const Template: ComponentStory<typeof ClearModal> = (args) => (
  <ClearModal {...args}>children placeholder</ClearModal>
)

export const Default = Template.bind({})
Default.args = {
  open: true,
  setOpen: () => {}
}
