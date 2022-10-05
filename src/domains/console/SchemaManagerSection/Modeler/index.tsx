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

export function Modeler() {
  const { isDark } = ThemeContext.useTheme()
  const { documentationValue } = consoleEditor.useConsoleEditor()
  const [text, setText] = useState<string>('')

  const [schema, setSchema] = useState<schemaType>()
  const update = async () => {
    const { schema: _schema } = utils.ycl_transpiler.parse(text, false)
    if (Object.keys(_schema).length > 0) {
      setSchema(_schema as schemaType)
    }
  }
  useDebounce(update, 1000, [text])

  useEffect(() => {
    if (documentationValue) {
      setText(documentationValue)
    }
  }, [documentationValue])

  return (
    <div className="flex w-full h-full">
      <section className="relative flex flex-col items-start border-r-2 w-[35%]">
        <CodeMirror
          value={text}
          className="flex w-full h-[29rem] max-h-[29rem] min-h-[29rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem] "
          width="100%"
          onChange={(val) => setText(val)}
          theme={isDark ? dracula : 'light'}
          extensions={[json(), EditorView.lineWrapping]}
        />
      </section>
      <div className="overflow-auto border-l-2 w-[65%]">
        <FlowView schema={schema} />
      </div>
    </div>
  )
}
