import * as common from 'common'
import { Icon } from '@iconify/react'
import CodeMirror from '@uiw/react-codemirror'

export function ApiSection() {
  return (
    <common.Card className="flex h-full">
      <div className="w-[50%] rounded-l-lg">
        <div className="flex items-center w-full h-12 px-4 bg-gray-200 border-gray-300 rounded-tl-lg border-x">
          <p>YCode Console</p>
          <button className="p-2 ml-4 bg-gray-400 rounded-full">
            <Icon icon="bxs:right-arrow" className={`w-4 h-4 transition`} />
          </button>
        </div>
        <div className="flex flex-col bg-gray-200 border-2 rounded-bl-lg">
          <div>
            <CodeMirror
              value={`# Looks like you do not have any tables.\n# Click on the 'Data' tab on top to create tables\n# Try out YCode queries here after you create tables;`}
              height="21.5rem"
              onChange={(value, viewUpdate) => {
                console.log('value:', value)
              }}
            />
          </div>
          <div className="flex w-full p-2 pb-0 pl-8 bg-gray-200 ring-1 ring-gray-300">
            Query variables
          </div>
          <div>
            <CodeMirror
              value=""
              height="10rem"
              onChange={(value, viewUpdate) => {
                console.log('value:', value)
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-[50%] rounded-r-lg">
        <div className="flex w-full p-3 px-4 pl-8 bg-gray-200 rounded-tr-lg">
          Response
        </div>
        <CodeMirror
          value=""
          height="33.75rem"
          onChange={(value, viewUpdate) => {
            console.log('value:', value)
          }}
          editable={false}
        />
      </div>
    </common.Card>
  )
}
