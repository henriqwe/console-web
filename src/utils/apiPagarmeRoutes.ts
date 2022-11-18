export const apiPagarmeRoutes = {
  customers: {
    list: 'customers',
    create: 'customers'
  },
  plans: {
    list: 'plans'
  },
  subscriptions: {
    create: 'subscriptions'
  },
  addresses: {
    create: (customerId: string) => `customers/${customerId}/addresses`
  }
}
