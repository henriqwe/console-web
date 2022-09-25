import FlowView from './FlowView'
import { useDebounce } from 'react-use'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import * as ThemeContext from 'contexts/ThemeContext'
import { useState } from 'react'
import { schemaType } from 'domains/console/SchemaManagerSection/Modeler/types'
import * as utils from 'utils'

const initial = `schema blog (
  !enabled
  'b6891cf5-5073-3a4b-a9e5-79443226a8a2'
  '2dc12e3f-b7d5-3bef-9c1e-1641ae4a8182'
) {
  entity post (
    sql
  ) {
    created (
      Long
    )
    description (
      String 256
      !nullable
    )
    title (
      String 256
      !nullable
    )
    slug (
      String 256
      !nullable
    )
    content (
      Text
      !nullable
    )
  }
  entity like (
    sql
  ) {
    posttolike (
      post
    )
    counter (
      Integer
    )
  }
  entity comment (
    sql
  ) {
    post (
      post
      !nullable
    )
    postslug (
      String 256
      !nullable
    )
    created (
      Long
    )
    content (
      String 512
    )
  }
}
`.trim()

export function Modeler() {
  const { isDark } = ThemeContext.useTheme()
  const [text, setText] = useState(initial)

  const [schema, setSchema] = useState<schemaType>()
  const update = async () => {
    const { schema: _schema } = utils.ycl_transpiler.parse(text, false)
    setSchema(_schema as schemaType)
  }
  useDebounce(update, 1000, [text])

  return (
    <div className="flex flex-col w-full h-full p-6">
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
      <pre className="overflow-auto border-l-2 w-[50%]">
        <FlowView schema={schema} />
      </pre>
    </div>
  )
}
