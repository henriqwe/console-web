import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Template } from '.'

import { PlayIcon, ReturnIcon, XIcon, EditIcon } from 'common/Icons'

const menuItens = [
  { name: 'Item 1', href: '#', icon: PlayIcon },
  { name: 'Item 2', href: '#', icon: ReturnIcon },
  { name: 'Item 3', href: '#', icon: XIcon },
  { name: 'Item 4', href: '#', icon: EditIcon }
]

const user = {
  name: 'Fulano',
  email: 'fulano@gmail.com',
  imageUrl:
    'https://images.pexels.com/photos/10673160/pexels-photo-10673160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
}

export default {
  title: 'Components/Template',
  component: Template
} as ComponentMeta<typeof Template>

const template: ComponentStory<typeof Template> = (args) => (
  <Template {...args} />
)

export const Default = template.bind({})
Default.args = { menuItens, user }
