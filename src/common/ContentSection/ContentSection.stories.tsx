import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ContentSection } from '.'

export default {
  title: 'Components/ContentSection',
  component: ContentSection
} as ComponentMeta<typeof ContentSection>

const Template: ComponentStory<typeof ContentSection> = (args) => (
  <ContentSection {...args}>
    <p>Children placeholder</p>
  </ContentSection>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Content Section'
}
