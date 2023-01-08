import * as common from 'common'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { useEffect } from 'react'
import * as utils from 'utils'
import * as ThemeContext from 'contexts/ThemeContext'
import { dracula } from '@uiw/codemirror-theme-dracula'

export function CodeExporterView() {
  const { isDark } = ThemeContext.useTheme()

  const {
    consoleValueLastOperation,
    formaterCodeExporterValue,
    codeExporterValue
  } = consoleEditor.useConsoleEditor()

  useEffect(() => {
    formaterCodeExporterValue()
  }, [consoleValueLastOperation])

  return (
    <div className="flex-1 p-2 border-2 border-gray-200 rounded-md">
      <CodeMirror
        value={codeExporterValue}
        className="text-xs break-all rounded-md "
        editable={false}
        theme={isDark ? dracula : 'light'}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false
        }}
        extensions={[javascript({ jsx: true })]}
      />

      <div className="flex justify-end flex-1">
        <div className="relative">
          <div
            onClick={() => {
              navigator.clipboard.writeText(codeExporterValue)
              utils.notification('Copied to clipboard', 'success')
            }}
            className="absolute -mt-8 -ml-8 text-gray-600 hover:cursor-pointer hover:text-gray-700"
            title="Click to copy!"
          >
            <common.icons.ClipboardIcon />
          </div>
        </div>
      </div>
    </div>
  )
}
