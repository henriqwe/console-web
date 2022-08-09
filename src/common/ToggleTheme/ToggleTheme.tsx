import { useEffect, useState } from 'react'
import React from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/outline'

type ToggleThemeProps = {
  className?: string
  changeColor?: boolean
}

function setTheme(theme: string) {
  const doc = document.documentElement

  doc.classList.forEach((className) => {
    doc.classList.remove(className)
  })

  doc.classList.add(theme)

  window.localStorage.setItem('theme', theme)
  window.dispatchEvent(new Event('storage'))
}

export function ToggleTheme({
  className,
  changeColor = true
}: ToggleThemeProps) {
  const [enabled, setEnabled] = useState(false)

  function changeTheme(theme?: string) {
    if (theme) {
      setEnabled(theme === 'dark')
      setTheme(theme)
    } else {
      setEnabled(!enabled)
      setTheme(enabled ? 'light' : 'dark')
    }
  }

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme') ?? 'light'

    changeTheme(storedTheme)
  }, [])

  return (
    <div
      onClick={() => changeTheme()}
      className={`
      ${className}
      ${
        changeColor
          ? 'dark:hover:bg-menuItem-secondary/50 hover:bg-gray-200/50 dark:text-text-primary'
          : 'text-white hover:bg-menuItem-secondary/40'
      } rounded-full p-2 cursor-pointer w-10 h-10`}
    >
      {enabled ? <SunIcon /> : <MoonIcon />}
    </div>
  )
}
