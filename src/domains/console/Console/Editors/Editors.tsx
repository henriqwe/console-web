import CodeMirror from '@uiw/react-codemirror'

import { javascript } from '@codemirror/lang-javascript'
import { useState } from 'react'
import { DatabaseIcon } from '@heroicons/react/outline'

import * as common from 'common'
import * as consoleSection from 'domains/console'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'

export function Editors() {
  const [slideOpen, setSlideOpen] = useState(false)

  const { setSelectedTab } = consoleSection.useSidebar()
  const { setCurrentTab, setShowTableViewMode } = consoleSection.useData()

  const {
    consoleValue,
    globalJavaScriptCompletions,
    runOperation,
    consoleResponseFormated,
    setConsoleValue,
    consoleResponseLoading,
    documentationValue
  } = consoleEditor.useConsoleEditor()

  return (
    <div className="flex w-full h-full rounded-lg">
      <div className="w-[50%] rounded-lg h-full">
        <div className="flex flex-col h-full rounded-lg">
          <div className="flex flex-col bg-gray-200 rounded-tl-lg h-full">
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
                className="flex w-full h-full"
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
        </div>
      </div>
      <div className="w-[50%] h-full flex flex-col">
        <div className="flex items-center w-full h-16 px-4 bg-gray-200 rounded-tr-lg">
          <div className="flex justify-between items-center w-full">
            <p className="text-lg font-bold text-gray-700">Response</p>
            <div>
              {consoleResponseFormated && (
                <button
                  className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
                  type="button"
                  onClick={() => {
                    setCurrentTab('DATA')
                    setSelectedTab({
                      name: 'DATA',
                      icon: DatabaseIcon
                    })
                    setShowTableViewMode(true)
                  }}
                >
                  Table mode
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full h-full overflow-x-auto rounded-br-lg">
          <CodeMirror
            value={consoleResponseFormated}
            className="flex w-full h-full"
            width="100%"
            editable={false}
            extensions={[javascript({ jsx: true })]}
          />
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
