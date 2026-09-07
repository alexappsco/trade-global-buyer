export const endpoints = {
  orders: {
    list: '/orders',
    create: '/orders',
    catalog: '/orders/catalog',
    details: (id: string) => `/orders/${id}`,
    close: (id: string) => `/orders/${id}/close`,
    quotationOffers: (orderId: string) => `/orders/${orderId}/quotation-offers`,
  },
  quotationOffers: {
    list: '/quotation-offers',
    details: (id: string) => `/quotation-offers/${id}`,
    accept: (id: string) => `/quotation-offers/${id}/accept`,
    decline: (id: string) => `/quotation-offers/${id}/decline`,
    submit: (orderId: string) => `/orders/${orderId}/quotation-offers`,
  },
};
