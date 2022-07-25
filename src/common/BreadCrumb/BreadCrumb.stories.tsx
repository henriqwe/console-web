import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Breadcrumb } from '.'

const pages = [
  { name: 'pagina um', current: false },
  { name: 'pagina dois', current: false },
  { name: 'pagina três', current: false },
  { name: 'pagina quatro', current: true }
]

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb
} as ComponentMeta<typeof Breadcrumb>

const Template: ComponentStory<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args} />
)

export const Default = Template.bind({})
Default.args = {
  pages,
  showNumber: false
}

export const showNumber = Template.bind({})
showNumber.args = {
  pages,
  showNumber: true
}
