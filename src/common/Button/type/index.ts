import { ReactNode } from 'react'

export type ButtonProps = {
  children?: React.ReactNode
  loading?: boolean
  onClick?: () => void
  iconPosition?: 'left' | 'right'
  icon?: ReactNode
  type?: 'button' | 'submit'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type BaseButtonProps = {
  children?: React.ReactNode
  buttonColor: string
  hoverButtonColor: string
  disableButtonColor: string
  textColor?: string
  loading?: boolean
  iconPosition?: 'left' | 'right'
  icon?: ReactNode
  type?: 'button' | 'submit'
} & React.ButtonHTMLAttributes<HTMLButtonElement>
