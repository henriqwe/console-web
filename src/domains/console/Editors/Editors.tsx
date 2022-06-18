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
      className="flex w-full h-full min-w-0 overflow-y-auto lg:order-last rounded-lg"
    >
      <div className="w-[50%] h-full">
        <div className="flex flex-col  h-full">
          <div className="flex flex-col  h-1/2 bg-gray-200">
            <div className="flex items-center w-full h-14 px-4 bg-gray-200  mb-1">
              <p className="text-lg font-bold text-gray-700">YCode Console</p>
              <button className="p-2 ml-4 rounded-full">
                <Icon icon="bxs:right-arrow" className={`w-4 h-4 transition`} />
              </button>
            </div>
            <div className="flex h-full  w-full ">
              <CodeMirror
                value={`// Looks like you do not have any tables.\n// Click on the 'Data' tab on top to create tables\n// Try out YCode queries here after you create tables;`}
                className="flex w-full h-ful"
                width="100%"
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
          <div className="flex flex-col  h-1/2">
            <div className="flex items-center w-full h-14 px-4 bg-gray-200">
              <p className="text-lg font-bold text-gray-700">Query variables</p>
            </div>
            <div className="flex h-full  w-full">
              <CodeMirror
                value=""
                className="flex w-full h-ful"
                width="100%"
                onChange={(value, viewUpdate) => {
                  console.log('value:', value)
                }}
                extensions={[javascript({ jsx: true })]}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50%] h-full">
        <div className="flex flex-col  h-full">
          <div className=" flex h-full flex-col  w-full">
            <div className="flex flex-col  h-full">
              <div className="flex items-center w-full h-14 px-4 bg-gray-200">
                <p className="text-lg font-bold text-gray-700">Response</p>
              </div>
              <div className="flex h-full  w-full">
                <CodeMirror
                  value=""
                  className="flex w-full h-full"
                  width="100%"
                  onChange={(value, viewUpdate) => {
                    console.log('value:', value)
                  }}
                  editable={false}
                  extensions={[javascript({ jsx: true })]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
