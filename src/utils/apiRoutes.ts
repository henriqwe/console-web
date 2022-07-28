export const apiRoutes = {
  schemas: `v0/modeler/project-name`,
  userAccount: '/account/account',
  roles: '/caccount/role',
  deleteRole: (name: string) => `/caccount/role/name/${name}`,
  getUserToken: '/security/oauth/token',
  deleteUserAccount: ({
    username,
    version
  }: {
    username: string
    version: string
  }) => `/caccount/account/username/${username}/version/${version}`,
  createAdminAccount: (
    projectName: string
  ) => `v0/modeler/project-name/${projectName}/schema/create-admin-account
  `,
  getAdminToken: '/csecurity/oauth/token',
  adminData: '/caccount/account',
  parseReverse: (projectName: string) =>
    `/project-name/${projectName}/parser/reverse`,
  entity: (projectName: string) =>
    `/project-name/${projectName}/schema/sql/entity`,
  attribute: ({
    projectName,
    entityName
  }: {
    projectName: string
    entityName: string
  }) =>
    `/project-name/${projectName}/schema/sql/entity/${entityName}/attribute`,
  local: {
    adminLogin: '/adminLogin',
    createAccount: '/createAccount',
    userLogin: '/login',
    parser: (projectName: string) => `/parser?parserName=${projectName}`,
    interpreter: '/interpreter',
    schema: (projectName: string) => `/schema?schemaName=${projectName}`
  }
}
