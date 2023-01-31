export const apiRoutes = {
  getUserHash: ({ username }: { username: string }) =>
    `v0/id/account/recovery-password/${username}`,
  changePassword: `v0/id/account/change-password`,
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
  userData: 'v0/id/account/get',
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
  businessrule: {
    upload: `/v0/businessrule/upload`
  },
  local: {
    adminLogin: '/adminLogin',
    createAccount: '/createAccount',
    getUserToken: '/getUserToken',
    userLogin: '/login',
    parser: (projectName: string) => `/parser?parserName=${projectName}`,
    interpreter: '/interpreter',
    schema: (projectName: string) => `/schema?schemaName=${projectName}`,
    pagarme: {
      customers: {
        create: '/pagarme/customers/create',
        list: '/pagarme/customers/list',
        getCustomerByEmail: (email?: string | null) =>
          `/pagarme/customers/getCustomerByEmail?email=${email}`
      },
      plans: {
        list: '/pagarme/plans/list'
      },
      subscriptions: {
        create: '/pagarme/subscriptions/create'
      },
      addresses: {
        create: '/pagarme/addresses/create'
      },
      cards: {
        create: `/pagarme/cards/create`,
        delete: `/pagarme/cards/delete`,
        list: (customerId: string) =>
          `/pagarme/cards/list?customerId=${customerId}`,
        getCard: (customerId: string, cardId: string) =>
          `/pagarme/cards/getCard?customerId=${customerId}&cardId=${cardId}`
      }
    },
    support: {
      ticket: '/support/ticket',
      message: '/support/message'
    }
  }
}
