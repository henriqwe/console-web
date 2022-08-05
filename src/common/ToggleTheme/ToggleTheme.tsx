import { useEffect, useState } from 'react'
import React from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/outline'

type ToggleThemeProps = {
  changeColor?: boolean
}

function setTheme(theme: string) {
  console.log('setTheme', theme)
  const doc = document.documentElement

  doc.classList.forEach((className) => {
    doc.classList.remove(className)
  })

  doc.classList.add(theme)

  window.localStorage.setItem('theme', theme)
}

export function ToggleTheme({ changeColor = true }: ToggleThemeProps) {
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
      className={`${
        changeColor
          ? 'dark:hover:bg-gray-800/50 hover:bg-gray-200/50 dark:text-white'
          : 'text-white hover:bg-gray-700/40'
      } rounded-full p-2 cursor-pointer w-10 h-10`}
    >
      {/* <span
          aria-hidden="true"
          className={`$
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
          `}
        /> */}
      {enabled ? <SunIcon /> : <MoonIcon />}
    </div>
  )
}
