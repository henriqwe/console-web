import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Tabs } from '.'

type Tab = {
  name: string
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
}

const tabs = [{ name: 'Tab 1' }, { name: 'Tab 2' }, { name: 'Tab 3' }]

export default {
  title: 'Components/Tabs',
  component: Tabs
} as ComponentMeta<typeof Tabs>

const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />

export const Default = Template.bind({})
Default.args = { tabs }
