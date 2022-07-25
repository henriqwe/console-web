import React, { ReactNode } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SlideWithTabs } from '.'

const content = (
  <ul>
    <li>Content placeholder</li>
    <li>Content placeholder</li>
    <li>Content placeholder</li>
    <li>Content placeholder</li>
  </ul>
)

type data = {
  title: string
  color: 'blue' | 'red'
  content: ReactNode
}[]

const tabsData: data = [
  { title: 'Tab 1', color: 'blue', content },
  { title: 'Tab 2', color: 'red', content },
  { title: 'Tab 3', color: 'blue', content }
]

const options = [
  { value: 1, name: 'Select 1' },
  { value: 2, name: 'Select 2' },
  { value: 3, name: 'Select 3' },
  { value: 4, name: 'Select 4' }
]

export default {
  title: 'Components/SlideWithTabs',
  component: SlideWithTabs
} as ComponentMeta<typeof SlideWithTabs>

const Template: ComponentStory<typeof SlideWithTabs> = (args) => (
  <SlideWithTabs {...args} />
)

export const Default = Template.bind({})
Default.args = {
  noPadding: false,
  tabsData,
  slideSize: 'normal'
}
