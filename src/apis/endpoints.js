export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  MACHINE_EFFICIENCY: {
    MACHINE_EFFICIENCY: '/machine-efficiency/machine-efficiency',
    FILTER_OPTIONS: '/machine-efficiency/filter-options',
    MACHINE_DRILLDOWN: (machineId) => `/machine-efficiency/machine/${machineId}`,
    ORDER_DRILLDOWN: (orderNum) => `/machine-efficiency/order/${orderNum}`,
  },

  PRODUCTION_TREND: {
    SUMMARY: '/production-trend/summary',
    MONTHLY: '/production-trend/monthly',
    YEARLY: '/production-trend/yearly',
    PRODUCT_SHARE: '/production-trend/product-share',
    YEAR_COMPARISON: '/production-trend/year-comparison',
    TABLE: '/production-trend/table',
    FILTERS: '/production-trend/filters',
  },
};