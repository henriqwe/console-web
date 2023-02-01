import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/solid'

import * as common from 'common'
import * as consoleSection from 'domains/console'
import * as ThemeContext from 'contexts/ThemeContext'
import * as utils from 'utils'

import CodeMirror from '@uiw/react-codemirror'
import { java, javaLanguage } from '@codemirror/lang-java'
import { json } from '@codemirror/lang-json'
import { EditorView, placeholder } from '@codemirror/view'
import { dracula } from '@uiw/codemirror-theme-dracula'
import axios from 'axios'

export function LambdaTab() {
  // const {
  //   entityData,
  //   selectedEntity,
  //   setReload,
  //   reload,
  //   setSelectedEntity,
  //   schemaTables
  // } = consoleSection.useSchemaManager()
  const [loading, setLoading] = useState(false)
  const { isDark } = ThemeContext.useTheme()

  const [rule, setRule] = useState(placeholderRule)

  async function handleSubmit() {
    setLoading(true)

    axios
      .post(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}${utils.apiRoutes.businessrule.upload}`,
        rule,
        {
          headers: {
            'Content-Type': 'text/plain',
            'X-TenantID': utils.getCookie('X-TenantID') as string,
            'X-TenantAC': utils.getCookie('X-TenantAC') as string
          }
        }
      )
      .then((res) => {
        if (res.status === 200) {
          utils.notification(`Rule uploaded successfully`, 'success')
        }
      })
      .catch((err) => {
        console.log(err)
        utils.showError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div
      className={`flex flex-col items-start rounded-b-md bg-white dark:bg-gray-800 p-6 gap-2`}
    >
      <p className="font-semibold">Business rule</p>
      <CodeMirror
        value={rule}
        onChange={(value) => setRule(value)}
        className="flex w-full h-[23.4rem] border border-gray-200 dark:border-gray-700"
        width="100%"
        theme={isDark ? dracula : 'light'}
        extensions={[
          EditorView.lineWrapping,
          java(),
          javaLanguage,
          json(),
          placeholder(placeholderRule)
        ]}
      />
      <common.Separator />
      <span className="flex w-full justify-end">
        <common.Buttons.WhiteOutline
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          icon={<CheckIcon className="w-3 h-3" />}
        >
          Upload rule
        </common.Buttons.WhiteOutline>
      </span>
    </div>
  )
}

const placeholderRule = `import org.json.JSONArray;
import org.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;

public class message implements BusinessRuleHandler
{
    public Datasource datasource = null;

    public JSONObject run(String action, JSONArray roles, String entityName, JSONObject entityData) throws Exception
    {

        return entityData;
    }
}`
