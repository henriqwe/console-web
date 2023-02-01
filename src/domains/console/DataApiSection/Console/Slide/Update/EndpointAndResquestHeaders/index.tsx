import { useForm, Controller } from 'react-hook-form'
import * as common from 'common'
import { getCookie } from 'utils'
import { useEffect } from 'react'
import * as utils from 'utils'
export function EndpointAndResquestHeadersView() {
  const {
    control,
    formState: { errors },
    setValue
  } = useForm()

  useEffect(() => {
    setValue(
      'YclEndpoint',
      `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/${utils.apiRoutes.interpreter}`
    )
  }, [])
  return (
    <div>
      <form>
        <Controller
          name="YclEndpoint"
          control={control}
          defaultValue={''}
          render={({ field: { onChange, value } }) => (
            <div className="mb-12">
              <common.Input
                placeholder="YCL Endpoint"
                label="YCL Endpoint"
                value={value}
                onChange={onChange}
                errors={errors.Name}
                icon={'POST'}
              />
            </div>
          )}
        />

        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-text-primary">
            Request headers
          </span>
          <common.EditableTable
            collection={[
              {
                headerEnable: true,
                headerKey: 'content-type',
                headerKeyValue: 'application/json'
              },
              {
                headerEnable: true,
                headerKey: 'X-TenantAC',
                headerKeyValue: getCookie('X-TenantAC'),
                inputType: 'password'
              },
              {
                headerEnable: true,
                headerKey: 'X-TenantID',
                headerKeyValue: getCookie('X-TenantID'),
                inputType: 'password'
              }
            ]}
            columns={[
              {
                title: 'Enable',
                type: 'checkbox',
                key: 'headerEnable'
              },
              {
                title: 'Key',
                type: 'input',
                key: 'headerKey',
                placeholder: 'Enter key'
              },
              {
                title: 'Value',
                type: 'password',
                key: 'headerKeyValue',
                placeholder: 'Enter value'
              }
            ]}
            control={control}
            fieldName="RequestHeaders"
          />
        </div>
      </form>
    </div>
  )
}
