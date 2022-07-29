import * as common from 'common'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { useEffect } from 'react'
import * as utils from 'utils'

export function CodeExporterView() {
  const {
    consoleValueLastOperation,
    formaterCodeExporterValue,
    codeExporterValue
  } = consoleEditor.useConsoleEditor()

  useEffect(() => {
    formaterCodeExporterValue()
  }, [consoleValueLastOperation])

  return (
    <div className="border-b border-b-gray-200">
      <CodeMirror
        value={codeExporterValue}
        className="flex w-full h-full -ml-14 text-xs "
        width="40rem"
        editable={false}
        extensions={[javascript({ jsx: true })]}
      />

      <div className="flex  justify-end w-full">
        <div className="relative bg-red-400">
          <div
            onClick={() => {
              navigator.clipboard.writeText(codeExporterValue)
              utils.notification('Copied to clipboard', 'success')
            }}
            className="absolute -mt-8 -ml-6 hover:cursor-pointer text-gray-600  hover:text-gray-700"
            title="Click to copy!"
          >
            <common.icons.ClipboardIcon />
          </div>
        </div>
      </div>
    </div>
  )
}
