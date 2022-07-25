import React, { ReactNode } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ActionsRow } from '.'

import {
  ClipboardIcon,
  CodeSquareIcon,
  ConsoleIcon,
  DeleteIcon
} from '../Icons'

const actions = [
  {
    title: 'Item 1',
    url: 'www.google.com',
    handler: () => {},
    icon: <ClipboardIcon />
  },
  {
    title: 'Item 2',
    url: 'www.google.com',
    handler: () => {},
    icon: <CodeSquareIcon />
  },
  {
    title: 'Item 3',
    url: 'www.google.com',
    handler: () => {},
    icon: <ConsoleIcon />
  },
  {
    title: 'Item 4',
    url: 'www.google.com',
    handler: () => {},
    icon: <DeleteIcon />
  }
]

export default {
  title: 'Components/ActionsRow',
  component: ActionsRow
} as ComponentMeta<typeof ActionsRow>

const Template: ComponentStory<typeof ActionsRow> = (args) => (
  <ActionsRow {...args} />
)

export const Default = Template.bind({})
Default.args = { actions }
