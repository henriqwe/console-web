import React, { ReactNode } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Table } from '.'

const tableColumns = [
  { name: '1', displayName: 'Column 1', handler: () => {} },
  { name: '1', displayName: 'Column 2', handler: () => {} },
  { name: '1', displayName: 'Column 3', handler: () => {} },
  { name: '1', displayName: 'Column 4', handler: () => {} }
]

const values = ['1', '2', '3', '4']

const node = <p>This is a node</p>

const actions = (item: {
  item: { title: string; fieldName: string }
}): ReactNode => node

export default {
  title: 'Components/Table',
  component: Table
} as ComponentMeta<typeof Table>

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />

export const Default = Template.bind({})
Default.args = { rounded: false, tableColumns, values, actions }
