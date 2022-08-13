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
import usePrettier from 'hooks/usePrettier'
import parserBabel from 'prettier/parser-babel'
import * as ThemeContext from 'contexts/ThemeContext'
import { DotsVerticalIcon } from '@heroicons/react/outline'

export function Editors() {
  const { isDark } = ThemeContext.useTheme()
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

  if (!isReady) return null

  return (
    <div className="flex flex-col w-full h-full" data-tour="step-4">
      <common.ContentSection
        variant="WithoutTitleBackgroundColor"
        title={
          <div className="grid grid-cols-3 items-center justify-between w-full">
            <div className="flex items-center">
              <common.Breadcrumb
                pages={[
                  { name: 'Data manager', current: false },
                  { name: 'Console', current: true }
                ]}
              />
              <div title="Endpoint and request headers">
                <common.icons.DotsVerticalIcon
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    setSlideState({
                      open: true,
                      type: 'EndpointAndResquestHeadersView'
                    })
                  }}
                />
              </div>
            </div>
            <div className="flex w-full justify-center">
              <p className="text-sm text-gray-900 dark:text-text-primary">
                Schema status:{' '}
                <span className="font-bold">
                  {schemaStatus === 2 ? 'Running' : 'Modeling'}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-4">
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
                  JSON
                </common.Buttons.White>
              ) : (
                <common.Buttons.White
                  type="button"
                  onClick={() => {
                    setShowTableViewMode(true)
                  }}
                >
                  Table
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
            } -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-200  h-14 w-14 border-4 border-white dark:border-gray-900 rounded-full`}
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
              <Icon
                icon="fa-solid:play"
                className={`w-4 h-4 text-gray-700 dark:text-gray-800`}
              />
            </div>
          </button>
        </div>
        <div className="grid w-full h-full grid-cols-12 border border-gray-200 dark:border-gray-700 ">
          <div
            className={`${
              showTableViewMode ? 'col-span-4' : 'col-span-6'
            } h-full rounded-lg flex`}
          >
            <div className="flex relative flex-col w-full h-[31rem] max-h-[31rem] min-h-[31rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem]   overflow-hidden rounded-l-lg">
              <CodeMirror
                value={consoleValue}
                className="flex w-full h-[31rem] max-h-[31rem] min-h-[31rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem] "
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
              <div className="absolute bottom-1 right-3">
                <button
                  type="button"
                  title="Format"
                  onClick={handleFormat}
                  className="flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200/50 w-7 h-7"
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
            <div className="flex w-full h-full overflow-hidden border-l border-gray-200 dark:border-gray-700 rounded-r-lg">
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
                <div className="flex flex-col w-full  h-[31rem] max-h-[31rem] min-h-[31rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem]  ">
                  <CodeMirror
                    value={consoleResponseFormated}
                    className="flex w-full h-[31rem] max-h-[31rem] min-h-[31rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem]"
                    width="100%"
                    theme={isDark ? dracula : 'light'}
                    editable={false}
                    extensions={[javascript({ jsx: true })]}
                    basicSetup={{
                      lineNumbers: false
                    }}
                  />
                  <div className="flex items-center justify-end px-4">
                    {responseTime && (
                      <div className="text-xs  h-8 flex items-center">
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
