import CodeMirror from '@uiw/react-codemirror'

import { Icon } from '@iconify/react'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { javascript } from '@codemirror/lang-javascript'
import * as common from 'common'
import * as utils from 'utils'
import * as consoleSection from 'domains/console'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { Slide } from '../Slide'
import { EditorView } from '@codemirror/view'
import usePrettier from 'domains/hooks/usePrettier'
import parserBabel from 'prettier/parser-babel'
import { useEffect, useState } from 'react'

function isDarkTheme() {
  try {
    const theme = window.localStorage.getItem('theme')

    return theme === 'dark'
  } catch (error) {
    return false
  }
}

export function Editors() {
  const [isDark, setIsDark] = useState(isDarkTheme())

  const {
    setShowTableViewMode,
    showTableViewMode,
    setSlideState,
    schemaStatus
  } = consoleSection.useSchemaManager()

  const {
    consoleValue,
    setConsoleValue,
    globalJavaScriptCompletions,
    runOperation,
    consoleResponseFormated,
    consoleResponseLoading,
    responseTime,
    consoleValueLastOperation,
    handleFormat,
    handleChange
  } = consoleEditor.useConsoleEditor()

  const isReady = usePrettier({
    parser: 'json',
    plugins: [parserBabel]
  })

  useEffect(() => {
    setIsDark(isDarkTheme())
  }, [])

  if (!isReady) return null

  window.onstorage = function () {
    setIsDark(isDarkTheme())
  }

  return (
    <div className="flex flex-col w-full h-full" data-tour="step-4">
      <common.ContentSection
        title={
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-900 dark:text-text-primary">
              YCodi Console
            </p>
            <p className="text-sm text-gray-900 dark:text-text-primary">
              Schema status:{' '}
              <span className="font-bold">
                {schemaStatus === 2 ? 'Running' : 'Modeling'}
              </span>
            </p>

            <div className="flex items-center justify-end gap-4">
              {consoleValueLastOperation && (
                <common.Buttons.Clean
                  type="button"
                  onClick={() => {
                    setSlideState({ open: true, type: 'CodeExporterView' })
                  }}
                >
                  Code exporter
                </common.Buttons.Clean>
              )}
              {showTableViewMode ? (
                <common.Buttons.Clean
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(false)
                  }}
                >
                  JSON mode
                </common.Buttons.Clean>
              ) : (
                <common.Buttons.Clean
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(true)
                  }}
                >
                  Table mode
                </common.Buttons.Clean>
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
            onClick={() => {
              if (schemaStatus !== 2) {
                utils.notification(
                  'you need to publish the schema to run the operation',
                  'error'
                )
                return
              }
              runOperation()
            }}
            disabled={consoleResponseLoading}
          >
            <div className="flex items-center justify-center">
              <Icon icon="fa-solid:play" className={`w-4 h-4 text-gray-700`} />
            </div>
          </button>
        </div>
        <div className="grid w-full h-full grid-cols-12 border border-gray-200 dark:border-gray-700">
          <div
            className={`${
              showTableViewMode ? 'col-span-4' : 'col-span-6'
            } h-full rounded-bl-lg flex`}
          >
            <div className="flex relative flex-col w-full h-full overflow-x-auto rounded-bl-lg">
              <CodeMirror
                value={consoleValue}
                className="flex w-full h-full max-h-screen"
                width="100%"
                onChange={(value, viewUpdate) => {
                  setConsoleValue(value)
                  handleChange(value)
                }}
                theme={isDark ? dracula : 'light'}
                extensions={[
                  javascript({ jsx: true }),
                  globalJavaScriptCompletions,
                  EditorView.lineWrapping
                ]}
              />
              <div className="absolute bottom-7 right-2">
                <button
                  type="button"
                  title="Format"
                  onClick={handleFormat}
                  className="hover:bg-gray-200/50 rounded-full cursor-pointer w-7 h-7 flex items-center justify-center"
                >
                  <Icon
                    icon="bxs:magic-wand"
                    className="w-5 h-5 text-gray-600 dark:text-text-primary"
                  />
                </button>
              </div>
              <div className="flex items-center justify-end h-6 px-4 "></div>
            </div>
          </div>
          <div
            className={`${
              showTableViewMode ? 'col-span-8' : 'col-span-6'
            }  h-full flex flex-col`}
          >
            <div className="flex w-full h-full overflow-x-auto border-l border-gray-200 dark:border-gray-700 rounded-br-lg">
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
                <div className="flex flex-col w-full">
                  <CodeMirror
                    value={consoleResponseFormated}
                    className="flex w-full h-full"
                    width="100%"
                    theme={isDark ? dracula : 'light'}
                    editable={false}
                    extensions={[javascript({ jsx: true })]}
                  />
                  <div className="flex items-center justify-end h-6 px-4 ">
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
