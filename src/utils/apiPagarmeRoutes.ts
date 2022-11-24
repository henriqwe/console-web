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
  },
  cards: {
    create: (customerId: string) => `customers/${customerId}/cards`,
    list: (customerId: string) => `customers/${customerId}/cards`,
    getCard: (customerId: string, cardId: string) =>
      `customers/${customerId}/cards/${cardId}`,
    delete: (customerId: string, cardId: string) =>
      `customers/${customerId}/cards/${cardId}`
  }
}
