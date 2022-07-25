import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Modal } from '.'

const description = 'Descrição do modal... string ou ReactNode'

export default {
  title: 'Components/Modal',
  component: Modal
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  setOpen: () => {},
  title: 'Título do modal',
  description,
  buttonTitle: 'Botão',
  disabled: false,
  loading: false
}

export const Disabled = Template.bind({})
Disabled.args = {
  open: true,
  setOpen: () => {},
  title: 'Título do modal',
  description,
  buttonTitle: 'Botão',
  disabled: true,
  loading: false
}

export const LoadingDisabled = Template.bind({})
LoadingDisabled.args = {
  open: true,
  setOpen: () => {},
  title: 'Título do modal',
  description,
  buttonTitle: 'Botão',
  disabled: true,
  loading: true
}
