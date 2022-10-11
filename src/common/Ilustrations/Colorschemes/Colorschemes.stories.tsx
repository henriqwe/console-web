import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Colorschemes } from '.'

export default {
  title: 'Components/Illustrations',
  component: Colorschemes
} as ComponentMeta<typeof Colorschemes>

const Template: ComponentStory<typeof Colorschemes> = (args) => <Colorschemes />

export const Default = Template.bind({})
Default.args = {}
