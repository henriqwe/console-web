import CodeMirror from '@uiw/react-codemirror'

import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import * as utils from 'utils'
import * as common from 'common'
import * as ThemeContext from 'contexts/ThemeContext'

import { javascript } from '@codemirror/lang-javascript'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export function SchemaFormater() {
  const [documentationValueParsed, setDocumentationValueParsed] = useState<{
    code: string
    schema: {}
    src: any
  }>()
  const { documentationValue, setSchemaTabData } =
    consoleEditor.useConsoleEditor()
  const { isDark } = ThemeContext.useTheme()
  const router = useRouter()

  const downloadTxtFile = () => {
    const element = document.createElement('a')
    const file = new Blob([documentationValue], {
      type: 'text/plain'
    })
    element.href = URL.createObjectURL(file)
    element.download = `schema ${router.query.name}.txt`
    document.body.appendChild(element)
    element.click()
  }

  useEffect(() => {
    if (documentationValue) {
      try {
        const parse = utils.ycl_transpiler.parse(documentationValue, false)
        setDocumentationValueParsed(parse)
      } catch (err) {
        console.error(err)
      }
    }
  }, [documentationValue])

  return (
    <div className="relative">
      <CodeMirror
        value={documentationValue}
        className=" text-xs rounded-md break-all"
        editable={false}
        theme={isDark ? dracula : 'light'}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false
        }}
        extensions={[javascript({ jsx: true })]}
      />
      <div className="absolute bottom-1 right-3" title={'Download schema'}>
        <button onClick={downloadTxtFile}>
          <common.icons.DownloadIcon className="w-5 h-5 text-gray-600 dark:text-text-primary" />
        </button>
      </div>
    </div>
  )
  // return (
  //   <div>
  //     {/* Schema namne */}
  //     <div>
  //       <div className="flex gap-2">
  //         <span>Schema</span>
  //         <span className="text-red-500">
  //           {documentationValueParsed?.schema.name}
  //         </span>
  //         <span className="text-yellow-500">&#40;</span>
  //       </div>
  //     </div>
  //     <div className="ml-8">
  //       <span className="text-blue-500">enable</span>
  //     </div>
  //     <div className="ml-4 flex gap-2">
  //       <span className="text-yellow-500">&#41;</span>{' '}
  //       <span className="text-yellow-500">&#123;</span>
  //     </div>
  //     {/* entities */}
  //     <div className="ml-4 flex gap-4 flex-col">
  //       {documentationValueParsed?.schema.entities?.map((entity, idx) => {
  //         return (
  //           <div key={idx} className="ml-4">
  //             <div className="flex gap-2">
  //               <span>entity</span>
  //               <span className="text-red-500">{entity.name}</span>
  //               <span className="text-yellow-500">&#123;</span>
  //             </div>
  //             {/* attributes */}
  //             <div className="ml-2">
  //               {entity?.attributes?.map((attribute, idx) => {
  //                 return (
  //                   <div key={idx} className="ml-2">
  //                     <div className="flex gap-2">
  //                       <span className="text-red-500"> {attribute.name}</span>
  //                       <span className="text-yellow-500">&#40;</span>
  //                     </div>
  //                     {/* attributes _conf */}
  //                     <div className="flex gap-2">
  //                       <span className="text-red-500">
  //                         {attribute?._conf
  //                           ? Object?.keys(attribute?._conf).map(
  //                               (value, idx) => {
  //                                 return (
  //                                   <span
  //                                     key={idx}
  //                                     className="text-blue-500 ml-2"
  //                                   >
  //                                     {attribute?._conf[value]?.value !== false
  //                                       ? attribute?._conf[value]?.value
  //                                       : `!${value}`}
  //                                   </span>
  //                                 )
  //                               }
  //                             )
  //                           : null}
  //                       </span>
  //                     </div>
  //                     <div className="">
  //                       <span className="text-yellow-500">&#41;</span>
  //                     </div>
  //                   </div>
  //                 )
  //               })}
  //             </div>
  //           </div>
  //         )
  //       })}
  //     </div>
  //     <div className="ml-8">
  //       <span className="text-yellow-500">&#125;</span>
  //     </div>
  //     <div className="ml-2">
  //       <span className="text-yellow-500">&#125;</span>
  //     </div>
  //   </div>
  // )
}
