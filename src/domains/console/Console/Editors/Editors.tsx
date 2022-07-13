import CodeMirror from '@uiw/react-codemirror'

import { Icon } from '@iconify/react'
import { javascript } from '@codemirror/lang-javascript'
import { useState } from 'react'

import * as common from 'common'
import * as consoleSection from 'domains/console'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'

export function Editors() {
  const [slideOpen, setSlideOpen] = useState(false)

  const { setShowTableViewMode, showTableViewMode } = consoleSection.useData()

  const {
    consoleValue,
    globalJavaScriptCompletions,
    runOperation,
    consoleResponseFormated,
    setConsoleValue,
    consoleResponseLoading,
    documentationValue,
    responseTime
  } = consoleEditor.useConsoleEditor()

  return (
    <div className="grid w-full h-full grid-cols-12 rounded-lg">
      <div
        className={`${
          showTableViewMode ? 'col-span-4' : 'col-span-6'
        } rounded-lg h-full`}
      >
        <div className="flex flex-col h-full bg-gray-200 rounded-tl-lg">
          <div className="flex items-center justify-between w-full pl-4 border-r h-9 border-r-gray-300">
            <p className="text-base text-gray-900">YCodi Console</p>
            <div className="flex h-full">
              <button
                className="flex items-center h-full gap-2 p-2 "
                title="Run"
                onClick={runOperation}
                disabled={consoleResponseLoading}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 border-2 border-gray-400 rounded-full"
                  title="Run"
                >
                  <Icon
                    icon="fa-solid:play"
                    className={`ml-1 w-3 h-3 text-gray-700`}
                  />
                </div>
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
      <div
        className={`${
          showTableViewMode ? 'col-span-8' : 'col-span-6'
        }  h-full flex flex-col`}
      >
        <div className="flex items-center w-full px-4 bg-gray-200 rounded-tr-lg h-9">
          <div className="flex items-center justify-between w-full">
            <p className="text-base text-gray-900">Response</p>
            <div className="flex items-center gap-2">
              {responseTime && (
                <div className="text-xs">Response time: {responseTime} ms</div>
              )}
              {showTableViewMode ? (
                <button
                  className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(false)
                  }}
                >
                  JSON mode
                </button>
              ) : (
                <button
                  className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
                  type="button"
                  onClick={() => {
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
          {consoleResponseLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="flex items-center gap-2">
                <div>Loading</div>
                <common.Spinner className="w-5 h-5" />
              </div>
            </div>
          ) : showTableViewMode ? (
            <consoleSection.TableViewMode />
          ) : (
            <CodeMirror
              value={consoleResponseFormated}
              className="flex w-full h-full"
              width="100%"
              editable={false}
              extensions={[javascript({ jsx: true })]}
            />
          )}
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
