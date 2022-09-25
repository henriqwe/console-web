import { ViewIcon } from './ViewIcon'
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'Geral/Icons/ViewIcon',
    component: ViewIcon
} as ComponentMeta<typeof ViewIcon>

const Template: ComponentStory<typeof ViewIcon> = (args) => <ViewIcon {...args} />

export const Default = Template.bind({})