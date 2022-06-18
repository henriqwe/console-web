import { javascript, javascriptLanguage } from '@codemirror/lang-javascript'
import { Icon } from '@iconify/react'
import CodeMirror from '@uiw/react-codemirror'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { getCookie } from 'utils/cookies'
import { completeFromGlobalScope } from './Autocomplete'

export function Editors() {
  const [editorValue, seteditorValue] = useState<string>()
  const globalJavaScriptCompletions = javascriptLanguage.data.of({
    autocomplete: completeFromGlobalScope
  })

  async function loadParser() {
    const { data } = await axios.get(
      `http://localhost:3000/api/parser?parserName=${'academia'}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    seteditorValue(data.data)
  }
  useEffect(() => {
    loadParser()
  }, [])

  return (
    <div className="flex w-full rounded-lg h-full">
      <div className="w-[50%] h-full">
        <div className="flex flex-col  h-full">
          <div className="flex flex-col  h-3/4 bg-gray-100">
            <div className="flex items-center w-full h-14 px-4 bg-gray-100  mb-1">
              <p className="text-lg font-bold text-gray-700">YCode Console</p>
              <button className="p-2 ml-4 rounded-full">
                <Icon icon="bxs:right-arrow" className={`w-4 h-4 transition`} />
              </button>
            </div>
            <div className="flex h-full  w-full overflow-x-auto ">
              <CodeMirror
                value={editorValue}
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
          <div className="flex flex-col  h-1/4">
            <div className="flex items-center w-full h-14 px-4 bg-gray-100">
              <p className="text-lg font-bold text-gray-700">Query variables</p>
            </div>
            <div className="flex h-full  w-full overflow-x-auto">
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
              <div className="flex items-center w-full h-14 px-4 bg-gray-100">
                <p className="text-lg font-bold text-gray-700">Response</p>
              </div>
              <div className="flex h-full  w-full overflow-x-auto">
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
    </div>
  )
}
