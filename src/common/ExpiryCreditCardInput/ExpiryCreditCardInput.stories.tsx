import { ExpiryCreditCardInput } from './ExpiryCreditCardInput'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useForm } from 'react-hook-form'

export default {
  title: 'Forms/Inputs/ExpiryCreditCardInput',
  component: ExpiryCreditCardInput
} as ComponentMeta<typeof ExpiryCreditCardInput>

const Template: ComponentStory<typeof ExpiryCreditCardInput> = (args) => {
  const { control } = useForm()
  return <ExpiryCreditCardInput {...args} control={control} />
}

export const Default = Template.bind({})

export const Complete = Template.bind({})
Complete.args = {
  icon: '@1',
  iconPosition: 'left'
}

export const IconRight = Template.bind({})
IconRight.args = {
  icon: '@1',
  iconPosition: 'right'
}

export const Disabled = Template.bind({})
Disabled.args = {
  icon: '@1',
  iconPosition: 'left',
  disabled: true
}
