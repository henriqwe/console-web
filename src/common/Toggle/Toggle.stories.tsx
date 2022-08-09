import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Toggle } from '.'

export default {
  title: 'Components/Toggle',
  component: Toggle
} as ComponentMeta<typeof Toggle>

const template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args} />
const [enabled, setEnabled] = useState(false)

export const Default = template.bind({})
Default.args = { enabled, setEnabled: () => setEnabled(!enabled) }
