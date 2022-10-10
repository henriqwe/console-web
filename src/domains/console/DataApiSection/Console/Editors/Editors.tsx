import CodeMirror from '@uiw/react-codemirror'
import parserBabel from 'prettier/parser-babel'
import usePrettier from 'hooks/usePrettier'

import * as common from 'common'
import * as ThemeContext from 'contexts/ThemeContext'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import * as utils from 'utils'
import * as consoleSection from 'domains/console'

import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { Slide } from 'domains/console/DataApiSection/Console/Slide'
import { EditorView } from '@codemirror/view'
import { Icon } from '@iconify/react'
import { useEffect } from 'react'

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
    handleChange,
    handleFormatQueryOrMutationAction,
    debounceEditor,
    currentEditorAction,
    consoleFormaterMensageError
  } = consoleEditor.useConsoleEditor()

  const isReady = usePrettier({
    parser: 'json',
    plugins: [parserBabel]
  })

  useEffect(() => {
    if (consoleValue) {
      const timeoutId = setTimeout(() => debounceEditor(), 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [consoleValue])

  if (!isReady) return null

  const dropdownActions = [
    {
      title: 'Read',
      onClick: () => {
        handleFormatQueryOrMutationAction({ action: 'READ' })
        return
      }
    },
    {
      title: 'Create',
      onClick: () => {
        handleFormatQueryOrMutationAction({ action: 'CREATE' })
        return
      }
    },
    {
      title: 'Update',
      onClick: () => {
        handleFormatQueryOrMutationAction({ action: 'UPDATE' })
        return
      }
    },
    {
      title: 'Delete',
      onClick: () => {
        handleFormatQueryOrMutationAction({ action: 'DELETE' })
        return
      }
    }
  ]

  return (
    <div className="flex flex-col w-full h-full" data-tour="step-4">
      <common.ContentSection
        variant="WithoutTitleBackgroundColor"
        title={
          <div className="grid grid-cols-2 items-center justify-between w-full">
            <div className="flex items-center z-50">
              <common.Breadcrumb
                pages={[
                  { content: 'Data Api', current: false },
                  { content: 'Console', current: false },
                  {
                    content: (
                      <common.Dropdown actions={dropdownActions}>
                        {utils.capitalizeWord(currentEditorAction)}
                      </common.Dropdown>
                    ),
                    current: true
                  }
                ]}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <div title="Endpoint and request headers">
                <common.icons.DotsVerticalIcon
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => {
                    setSlideState({
                      open: true,
                      type: 'EndpointAndResquestHeadersView'
                    })
                  }}
                />
              </div>
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
                  'You need to publish the schema to run the operation',
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
            <div className="flex relative flex-col w-full h-[29rem] max-h-[29rem] min-h-[29rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem] rounded-l-lg">
              <CodeMirror
                value={consoleValue}
                className="flex w-full h-[29rem] max-h-[29rem] min-h-[29rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem] "
                width="100%"
                onChange={(value, viewUpdate) => {
                  setConsoleValue(value)
                  handleChange(value)
                }}
                theme={isDark ? dracula : 'light'}
                extensions={[
                  json(),
                  globalJavaScriptCompletions,
                  EditorView.lineWrapping
                ]}
              />
              <div className="absolute bottom-2 right-3 flex gap-1">
                {consoleFormaterMensageError && (
                  <div
                    className="flex items-center justify-center rounded-full cursor-pointer  w-7 h-7 "
                    title={consoleFormaterMensageError}
                  >
                    <Icon
                      icon="eva:alert-circle-fill"
                      className="w-6 h-6 text-red-600 dark:text-red-600"
                    />
                  </div>
                )}
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

                <button
                  type="button"
                  title="Code exporter"
                  onClick={() => {
                    setSlideState({ open: true, type: 'CodeExporterView' })
                  }}
                  className="flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200/50 w-7 h-7"
                >
                  <common.icons.DownloadIcon className="w-5 h-5 text-gray-600 dark:text-text-primary" />
                </button>
              </div>
              <div className="flex items-center h-6 px-2"></div>
            </div>
          </div>
          <div
            className={`${
              showTableViewMode ? 'col-span-8' : 'col-span-6'
            }  h-full flex flex-col`}
          >
            <div className="flex relative w-full h-full overflow-hidden border-l border-gray-200 dark:border-gray-700 rounded-r-lg">
              {consoleResponseLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="flex items-center gap-2">
                    <div>Loading</div>
                    <common.Spinner className="w-5 h-5" />
                  </div>
                </div>
              ) : (
                <div className="flex relative flex-col w-full  h-[29rem] max-h-[29rem] min-h-[29rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem]  ">
                  {showTableViewMode ? (
                    <consoleSection.TableViewMode />
                  ) : (
                    <CodeMirror
                      value={consoleResponseFormated}
                      className="flex w-full h-[29rem] max-h-[29rem] min-h-[29rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem]"
                      width="100%"
                      theme={isDark ? dracula : 'light'}
                      editable={false}
                      extensions={[json()]}
                      basicSetup={{
                        lineNumbers: false
                      }}
                    />
                  )}
                  <div className="absolute bottom-2 right-3">
                    {consoleResponseFormated &&
                      (showTableViewMode ? (
                        <button
                          type="button"
                          title="JSON View"
                          onClick={() => {
                            setShowTableViewMode(false)
                          }}
                          className="flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200/50 w-7 h-7 bg-white dark:bg-gray-900"
                        >
                          <Icon
                            icon="ph:brackets-curly-bold"
                            className="w-4 h-4 text-gray-600 dark:text-text-primary "
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Table View"
                          onClick={() => {
                            setShowTableViewMode(true)
                          }}
                          className="flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200/50 w-7 h-7"
                        >
                          <Icon
                            icon="bi:table"
                            className="w-4 h-4 text-gray-600 dark:text-text-primary"
                          />
                        </button>
                      ))}
                  </div>
                  {!showTableViewMode && (
                    <div className="flex items-center justify-end h-6 px-2">
                      {responseTime && (
                        <div className="text-xs  h-8 flex items-center">
                          Response time: {responseTime} ms
                        </div>
                      )}
                    </div>
                  )}
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
