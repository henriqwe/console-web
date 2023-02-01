import * as utils from 'utils'

type FormData = {
  comment?: string
  isIndex?: boolean
  nullable?: boolean
  unique?: boolean
  name?: string
  length?: number
  type?: string
}

export async function updateAttribute({
  name,
  accessToken,
  entityName,
  projectName,
  formData
}: {
  name: string
  accessToken: string
  entityName: string
  projectName: string
  formData: FormData
}) {
  return utils.api.put(
    `${utils.apiRoutes.attribute({
      entityName: entityName,
      projectName: projectName
    })}/${name}`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
