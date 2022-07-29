import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { AccordionList } from '.'

const content = [
  {
    title: 'title 1',
    content: <li className="mb-2">Content placeholder 1</li>
  },
  {
    title: 'title 2',
    content: <li className="mb-2">Content placeholder 2</li>
  },
  {
    title: 'title 3',
    content: <li className="mb-2">Content placeholder 3</li>
  },
  {
    title: 'title 4',
    content: <li className="mb-2">Content placeholder 4</li>
  },
  { title: 'title 5', content: <li className="mb-2">Content placeholder 5</li> }
]

export default {
  title: 'Components/AccordionList',
  component: AccordionList
} as ComponentMeta<typeof AccordionList>

const Template: ComponentStory<typeof AccordionList> = (args) => (
  <AccordionList {...args} />
)

export const Default = Template.bind({})
Default.args = {
  content
}
