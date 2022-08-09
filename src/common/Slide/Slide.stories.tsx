import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Slide } from '.'

const content = (
  <ul>
    <li>Content placeholder 1</li>
    <li>Content placeholder 2</li>
    <li>Content placeholder 3</li>
    <li>Content placeholder 4</li>
  </ul>
)

export default {
  title: 'Components/Slide',
  component: Slide
} as ComponentMeta<typeof Slide>

const Template: ComponentStory<typeof Slide> = (args) => <Slide {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  noPadding: false,
  title: 'Título do Slide',
  slideSize: 'normal',
  content
}
