import { useEffect, useState, useCallback } from 'react'
import { format } from 'prettier/standalone'
import { Options } from 'prettier'
import { useConsoleEditor } from 'domains/console/ConsoleEditorContext'

export default function usePrettier(options: Options) {
  const [mounted, setMounted] = useState(false)
  const { setFormatter } = useConsoleEditor()
  const formatter = useCallback(
    (code: string) => format(code, options),
    [options]
  )
  useEffect(() => {
    setFormatter(formatter)
    setMounted(true)
  }, [setFormatter, formatter, options])

  return mounted
}
