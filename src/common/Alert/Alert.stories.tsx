import { Alert } from './Alert'
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
title: 'Alert',
component: Alert
} as ComponentMeta <typeof Alert> 

const Template: ComponentStory <typeof Alert> = (args) => <Alert {...args} />

export const Default = Template.bind({})
Default.args = {
    title: 'Dados enviados com sucesso!',
    theme: 'info'
}

export const Info = Template.bind({})
Info.args = {
    title: 'Dados enviados com sucesso!',
    theme: 'info'
}

export const Warning = Template.bind({})
Warning.args = {
    title: 'Erro ao enviar os dados, tente novamente',
    theme: 'warning'
}