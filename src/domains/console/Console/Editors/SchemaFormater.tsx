import { useEffect } from 'react'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import * as utils from 'utils'

export function SchemaFormater() {
  const { documentationValue, setSchemaTabData } =
    consoleEditor.useConsoleEditor()

  const documentationValueParsed =
    utils.ycl_transpiler.parse(documentationValue)
  console.log('documentationValueParsed', documentationValueParsed)
  return (
    <div>
      {/* Schema namne */}
      <div>
        <div className="flex gap-2">
          <span>Schema</span>
          <span className="text-red-500">
            {documentationValueParsed?.schema.name}
          </span>
          <span className="text-yellow-500">&#40;</span>
        </div>
      </div>
      <div className="ml-8">
        <span className="text-blue-500">enable</span>
      </div>
      <div className="ml-4 flex gap-2">
        <span className="text-yellow-500">&#41;</span>{' '}
        <span className="text-yellow-500">&#123;</span>
      </div>
      {/* entities */}
      <div className="ml-4 flex gap-4">
        {documentationValueParsed?.schema.entities?.map((entity, idx) => {
          return (
            <div key={idx} className="ml-4">
              <div className="flex gap-2">
                <span>entity</span>
                <span className="text-red-500">{entity.name}</span>
                <span className="text-yellow-500">&#123;</span>
              </div>
              {/* attributes */}
              <div className="ml-2">
                {entity?.attributes?.map((attribute, idx) => {
                  return (
                    <div key={idx} className="ml-2">
                      <div className="flex gap-2">
                        <span className="text-red-500"> {attribute.name}</span>
                        <span className="text-yellow-500">&#40;</span>
                      </div>
                      {/* attributes _conf */}
                      <div className="flex gap-2">
                        <span className="text-red-500">
                          {attribute?._conf
                            ? Object?.keys(attribute?._conf).map(
                                (value, idx) => {
                                  return (
                                    <span
                                      key={idx}
                                      className="text-blue-500 ml-2"
                                    >
                                      {attribute?._conf[value]?.value !== false
                                        ? attribute?._conf[value]?.value
                                        : `!${value}`}
                                    </span>
                                  )
                                }
                              )
                            : null}
                        </span>
                      </div>
                      <div className="">
                        <span className="text-yellow-500">&#41;</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="ml-8">
        <span className="text-yellow-500">&#125;</span>
      </div>
      <div className="ml-2">
        <span className="text-yellow-500">&#125;</span>
      </div>
    </div>
  )
}
