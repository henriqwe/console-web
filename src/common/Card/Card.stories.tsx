import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Card } from './'

export default {
  title: 'Components/Card',
  component: Card
} as ComponentMeta<typeof Card>

const Template: ComponentStory<typeof Card> = (args) => (
  <Card {...args}>
    <h1>Card content</h1>
  </Card>
)

export const Default = Template.bind({})
Default.args = {}
