import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { responseTheme } from '../Editors/Themes'
import { useEffect, useState } from 'react'
import * as utils from 'utils'
import * as common from 'common'

export function CodeExporter() {
  const { consoleValueLastOperation, consoleValue } =
    consoleEditor.useConsoleEditor()
  const [codeExporterValue, setCodeExporterValue] = useState('')

  function formaterCodeExporterValue() {
    const text = `  async function yc_persistence_service(jwt, tenantID, BODY) {
    const result = await fetch('https://api.ycodify.com/api/interpreter-p/s', 
    {
      method: 'POST',
      body: BODY,
      headers: {
        Authorization: 'Bearer '.concat(jwt),
        'X-TenantID': tenantID,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    return await result.json()
  }
  `
    setCodeExporterValue(text)
  }

  useEffect(() => {
    formaterCodeExporterValue()
  }, [consoleValue])

  return (
    <div>
      <div className="flex justify-between items-center px-4 bg-gray-200 h-10">
        <span className="text-sm text-gray-900">Code exporter</span>
        <common.Buttons.White
          onClick={() => {
            navigator.clipboard.writeText(codeExporterValue)
            utils.notification('Copied to clipboard', 'success')
          }}
          title="Click to copy!"
        >
          <common.icons.ClipboardIcon />
        </common.Buttons.White>
      </div>
      <CodeMirror
        value={codeExporterValue}
        className="flex w-full h-full -ml-8 "
        // theme={responseTheme}
        editable={false}
        extensions={[javascript({ jsx: true })]}
      />
    </div>
  )
}
