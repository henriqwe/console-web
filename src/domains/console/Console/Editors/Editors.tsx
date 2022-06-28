import { javascript } from '@codemirror/lang-javascript'
import { Icon } from '@iconify/react'
import CodeMirror from '@uiw/react-codemirror'
import * as common from 'common'
import { useState } from 'react'

import * as consoleEditor from '../../ConsoleEditorContext'
export function Editors() {
  const [slideOpen, setSlideOpen] = useState(false)

  const {
    consoleValue,
    globalJavaScriptCompletions,
    runOperation,
    consoleResponse,
    setConsoleValue,
    consoleResponseLoading,
    documentationValue
  } = consoleEditor.useConsoleEditor()

  return (
    <div className="flex w-full h-full rounded-lg">
      <div className="w-[50%] max-h-[77vh] rounded-lg h-full">
        <div className="flex flex-col h-full rounded-lg">
          <div className="flex flex-col bg-gray-200 rounded-tl-lg h-3/4">
            <div className="flex items-center justify-between w-full pl-4 border-r min-h-[3.5rem] max-h-[3.5rem] border-r-gray-300">
              <p className="text-lg font-bold text-gray-700">YCode Console</p>
              <div className="flex h-full">
                <button
                  className="flex items-center h-full gap-2 p-2 text-blue-400 border-gray-400 border-x"
                  title="Run"
                  onClick={runOperation}
                  disabled={consoleResponseLoading}
                >
                  Run
                  {consoleResponseLoading && (
                    <div className="w-4 h-4">
                      <common.Spinner />
                    </div>
                  )}
                </button>
                <button
                  className="flex items-center h-full gap-2 p-2 text-blue-400 border-gray-400 border-x"
                  title="Docs"
                  onClick={() => setSlideOpen(!slideOpen)}
                  disabled={consoleResponseLoading}
                >
                  Docs
                </button>
              </div>
            </div>
            <div className="flex w-full h-full overflow-x-auto ">
              <CodeMirror
                value={consoleValue}
                className="flex w-full h-ful"
                width="100%"
                onChange={(value, viewUpdate) => {
                  setConsoleValue(value)
                }}
                extensions={[
                  javascript({ jsx: true }),
                  globalJavaScriptCompletions
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col h-1/4">
            <div className="flex items-center w-full px-4 bg-gray-200 h-14">
              <p className="text-lg font-bold text-gray-700">Query variables</p>
            </div>
            <div className="flex w-full h-full overflow-x-auto rounded-bl-lg">
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
        <div className="flex flex-col h-full">
          <div className="flex flex-col w-full h-full ">
            <div className="flex flex-col h-full">
              <div className="flex items-center w-full h-16 px-4 bg-gray-200 rounded-tr-lg">
                <p className="text-lg font-bold text-gray-700">Response</p>
              </div>
              <div className="flex w-full h-full overflow-x-auto rounded-br-lg">
                <CodeMirror
                  value={consoleResponse}
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
      <common.Slide
        open={slideOpen}
        setOpen={setSlideOpen}
        title={'Documentation'}
        content={
          <div>
            <span className="whitespace-pre-wrap">{`${documentationValue}`}</span>
          </div>
        }
      />
    </div>
  )
}
