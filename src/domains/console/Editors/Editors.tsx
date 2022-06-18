import { javascript, javascriptLanguage } from '@codemirror/lang-javascript'
import { Icon } from '@iconify/react'
import CodeMirror from '@uiw/react-codemirror'
import { completeFromGlobalScope } from './Autocomplete'

export function Editors() {
  const globalJavaScriptCompletions = javascriptLanguage.data.of({
    autocomplete: completeFromGlobalScope
  })
  return (
    <section
      aria-labelledby="primary-heading"
      className="flex w-[80%] h-full min-w-0 overflow-y-auto lg:order-last"
    >
      <div className="w-[50%]">
        <div className="flex items-center w-full h-12 px-4 bg-gray-200 border-gray-300 ring-1 ring-gray-300 border-x">
          <p>YCode Console</p>
          <button className="p-2 ml-4 bg-gray-400 rounded-full">
            <Icon icon="bxs:right-arrow" className={`w-4 h-4 transition`} />
          </button>
        </div>
        <div className="flex flex-col bg-gray-200 border-2">
          <div>
            <CodeMirror
              value={`// Looks like you do not have any tables.\n// Click on the 'Data' tab on top to create tables\n// Try out YCode queries here after you create tables;`}
              height="50vh"
              onChange={(value, viewUpdate) => {
                console.log('value:', value)
              }}
              extensions={[
                javascript({ jsx: true }),
                globalJavaScriptCompletions
              ]}
            />
          </div>
          <div className="flex w-full p-2 pb-0 pl-8 bg-gray-200 ring-1 ring-gray-300">
            Query variables
          </div>
          <div>
            <CodeMirror
              value=""
              height="35vh"
              onChange={(value, viewUpdate) => {
                console.log('value:', value)
              }}
              extensions={[
                javascript({ jsx: true }),
                globalJavaScriptCompletions
              ]}
            />
          </div>
        </div>
        <div className=""></div>
      </div>
      <div className="w-[50%]">
        <div className="flex w-full p-3 px-4 pl-8 bg-gray-200 ring-1 ring-gray-300">
          Response
        </div>
        <CodeMirror
          value=""
          height="90vh"
          onChange={(value, viewUpdate) => {
            console.log('value:', value)
          }}
          editable={false}
          extensions={[javascript({ jsx: true })]}
        />
      </div>
    </section>
  )
}
