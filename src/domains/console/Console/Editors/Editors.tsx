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
    <div className="flex w-full h-full flex-col">
      <common.ContentSection
        title={
          <>
            <p className="text-sm text-gray-900">YCodi Console</p>
            <div className="flex items-center gap-2">
              {responseTime && (
                <div className="text-xs">Response time: {responseTime} ms</div>
              )}
              {showTableViewMode ? (
                <common.Buttons.White
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-md"
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(false)
                  }}
                >
                  JSON mode
                </common.Buttons.White>
              ) : (
                <button
                  className="px-2.5 py-1.5 text-xs bg-white rounded-md"
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(true)
                  }}
                >
                  Table mode
                </button>
              )}
            </div>
          </>
        }
      >
        <div>
          <div className="relative items-center justify-center">
            <button
              title="Run"
              className={`absolute items-center justify-center mt-10 ${
                showTableViewMode ? 'left-1/3' : 'left-2/4'
              } -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-200 h-14 w-14 border-4 border-white rounded-full`}
              onClick={runOperation}
              disabled={consoleResponseLoading}
            >
              <div className="flex items-center justify-center">
                <Icon
                  icon="fa-solid:play"
                  className={`w-4 h-4 text-gray-700`}
                />
              </div>
            </button>
          </div>
        </div>
        <div className="grid w-full grid-cols-12 rounded-lg h-full">
          <div
            className={`${
              showTableViewMode ? 'col-span-4' : 'col-span-6'
            } h-full rounded-bl-lg`}
          >
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
          <div
            className={`${
              showTableViewMode ? 'col-span-8' : 'col-span-6'
            }  h-full flex flex-col`}
          >
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
      </common.ContentSection>
    </div>
  )
}
