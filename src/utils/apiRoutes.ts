export const apiRoutes = {
  schemas: `v0/modeling/project-name`,
  association: ({
    projectName,
    entityName
  }: {
    projectName: string
    entityName: string
  }) =>
    `v0/modeling/project-name/${projectName}/schema/sql/entity/${entityName}/association`,
  userAccount: 'v0/id/account/get-all',
  createAccount: 'v0/id/account/create',
  updateAccount: 'v0/id/account/update',
  roles: 'v0/id/role/get-all',
  createRole: 'v0/id/role/create',
  updateRole: 'v0/id/role/update',
  deleteRole: 'v0/id/role/delete',
  getUserToken: 'v0/auth/oauth/token',
  interpreter: 'v0/persistence/s/no-ac',
  deleteUserAccount: ({
    username,
    version
  }: {
    username: string
    version: string
  }) => `/caccount/account/username/${username}/version/${version}`,
  createAdminAccount: (projectName: string) =>
    `v0/modeling/project-name/${projectName}/schema/create-admin-account`,
  getAdminToken: '/csecurity/oauth/token',
  adminData: '/caccount/account',
  parseReverse: (projectName: string) =>
    `v0/modeling/project-name/${projectName}/parser/reverse`,
  entityList: (projectName: string) =>
    `v0/modeling/project-name/${projectName}/schema/sql`,
  entity: (projectName: string) =>
    `v0/modeling/project-name/${projectName}/schema/sql/entity`,
  attribute: ({
    projectName,
    entityName
  }: {
    projectName: string
    entityName: string
  }) =>
    `v0/modeling/project-name/${projectName}/schema/sql/entity/${entityName}/attribute`,
  local: {
    adminLogin: '/adminLogin',
    createAccount: '/createAccount',
    userLogin: '/login',
    parser: (projectName: string) => `/parser?parserName=${projectName}`,
    interpreter: '/interpreter',
    schema: (projectName: string) => `/schema?schemaName=${projectName}`
  }
}
