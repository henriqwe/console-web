import FlowView from './FlowView'
import { useDebounce } from 'react-use'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import * as ThemeContext from 'contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { schemaType } from 'domains/console/SchemaManagerSection/Modeler/types'
import * as utils from 'utils'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { Tour } from './Tour'
import { Icon } from '@iconify/react'

export function Modeler() {
  const { isDark } = ThemeContext.useTheme()
  const { documentationValue, textModeler, setTextModeler } =
    consoleEditor.useConsoleEditor()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [schema, setSchema] = useState<schemaType>()
  const update = async () => {
    try {
      const { schema: _schema } = utils.ycl_transpiler.parse(textModeler, false)
      if (Object.keys(_schema).length > 0) {
        setSchema(_schema as schemaType)
        setErrorMessage(undefined)
      }
    } catch (err) {
      setErrorMessage(err?.message as string)
    }
  }
  useDebounce(update, 1000, [textModeler])

  useEffect(() => {
    if (documentationValue) {
      setTextModeler(documentationValue)
    }
  }, [documentationValue])

  return (
    <>
      <Tour />
      <div className="flex w-full h-full">
        <section className="modeler-step-4 relative flex flex-col items-start border-r-2 w-[35%]">
          <CodeMirror
            value={textModeler}
            className="flex w-full h-[29rem] max-h-[29rem] min-h-[29rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem] "
            width="100%"
            onChange={(val) => setTextModeler(val)}
            theme={isDark ? dracula : 'light'}
            extensions={[json(), EditorView.lineWrapping]}
          />
          <div className="absolute bottom-2 right-3 flex gap-1">
            {errorMessage && (
              <div
                className="flex items-center justify-center rounded-full cursor-pointer  w-7 h-7 "
                title={errorMessage}
              >
                <Icon
                  icon="eva:alert-circle-fill"
                  className="w-6 h-6 text-red-600 dark:text-red-600"
                />
              </div>
            )}
          </div>
        </section>
        <div className="modeler-step-5 overflow-auto border-l-2 w-[65%]">
          <FlowView schema={schema} />
        </div>
      </div>
    </>
  )
}
