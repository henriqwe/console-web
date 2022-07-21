import CodeMirror from '@uiw/react-codemirror'

import { Icon } from '@iconify/react'
import { javascript } from '@codemirror/lang-javascript'

import * as common from 'common'
import * as consoleSection from 'domains/console'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { consoleTheme, responseTheme } from './Themes'
import { Slide } from '../Slide'

export function Editors() {
  const { setShowTableViewMode, showTableViewMode, setSlideState } =
    consoleSection.useData()

  const {
    consoleValue,
    globalJavaScriptCompletions,
    runOperation,
    consoleResponseFormated,
    setConsoleValue,
    consoleResponseLoading,
    responseTime,
    consoleValueLastOperation
  } = consoleEditor.useConsoleEditor()

  return (
    <div className="flex w-full h-full flex-col">
      <common.ContentSection
        title={
          <div className="flex  justify-between w-full items-center">
            <p className="text-sm text-gray-900">YCodi Console</p>
            <div className="flex items-center gap-4 justify-end">
              {consoleValueLastOperation && (
                <common.Buttons.White
                  type="button"
                  onClick={() => {
                    setSlideState({ open: true, type: 'CodeExporterView' })
                  }}
                >
                  Code exporter
                </common.Buttons.White>
              )}
              {showTableViewMode ? (
                <common.Buttons.White
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(false)
                  }}
                >
                  JSON mode
                </common.Buttons.White>
              ) : (
                <common.Buttons.White
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(true)
                  }}
                >
                  Table mode
                </common.Buttons.White>
              )}
            </div>
          </div>
        }
      >
        <div className="relative items-center justify-center">
          <button
            title="Run"
            className={`absolute items-center justify-center mt-10 ${
              showTableViewMode ? 'left-1/3' : 'left-2/4'
            } -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-200 h-14 w-14 border-4 border-white rounded-full`}
            onClick={runOperation}
            disabled={consoleResponseLoading}
          >
            <div className="flex items-center justify-center">
              <Icon icon="fa-solid:play" className={`w-4 h-4 text-gray-700`} />
            </div>
          </button>
        </div>
        <div className="grid w-full grid-cols-12 h-full border border-gray-200">
          <div
            className={`${
              showTableViewMode ? 'col-span-4' : 'col-span-6'
            } h-full rounded-bl-lg`}
          >
            <div className="flex w-full h-full overflow-x-auto rounded-bl-lg">
              <CodeMirror
                value={consoleValue}
                className="flex w-full h-full"
                width="100%"
                onChange={(value, viewUpdate) => {
                  setConsoleValue(value)
                }}
                // theme={consoleTheme}
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
                <div className="flex flex-col w-full ">
                  <CodeMirror
                    value={consoleResponseFormated}
                    className="flex w-full h-full "
                    width="100%"
                    // theme={responseTheme}
                    editable={false}
                    extensions={[javascript({ jsx: true })]}
                  />
                  <div className=" flex justify-end h-6 items-center px-4">
                    {responseTime && (
                      <div className="text-xs">
                        Response time: {responseTime} ms
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </common.ContentSection>
      <Slide />
    </div>
  )
}
